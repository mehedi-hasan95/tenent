import { RouteHandler } from "@workspace/open-api"
import {
  getActiveBoostingCoinRoute,
  getAllBoostedProductsRoute,
  productBoostingRoute,
  vendorCoinPurchaseHistoryRoute,
  vendorCoinsRoute,
} from "./boosting-route"
import { and, count, db, desc, eq, gt, gte, sql } from "@workspace/db"
import {
  boosting_coin,
  product_boost,
  vendor_coin,
  vendor_coin_purchase,
} from "@workspace/db/schema/boosting.schema"
import { products } from "@workspace/db/schema/products.schema"

export const getActiveBoostingCoinHandler: RouteHandler<
  typeof getActiveBoostingCoinRoute
> = async (c) => {
  try {
    const data = await db.query.boosting_coin.findFirst({
      where: eq(boosting_coin.is_active, true),
    })
    return c.json({ data }, 200)
  } catch (error) {
    return c.json({ message: "Something went wrong" }, 500)
  }
}

export const vendorCoinsHandler: RouteHandler<typeof vendorCoinsRoute> = async (
  c
) => {
  try {
    const email = c.get("user")?.email
    const data = await db.query.vendor_coin.findFirst({
      where: eq(vendor_coin.email, email!),
    })
    return c.json({ data: data ?? null }, 200)
  } catch (error) {
    return c.json({ message: "Something went wrong" }, 500)
  }
}

export const vendorCoinPurchaseHistoryHandler: RouteHandler<
  typeof vendorCoinPurchaseHistoryRoute
> = async (c) => {
  try {
    const { limit, page } = c.req.valid("query")
    const email = c.get("user")?.email
    const offset = (page - 1) * limit

    const [data, totalResult] = await Promise.all([
      db.query.vendor_coin_purchase.findMany({
        where: eq(vendor_coin_purchase.email, email!),
        orderBy: [desc(vendor_coin_purchase.createdAt)],
        limit,
        offset,
      }),
      db
        .select({ count: count() })
        .from(vendor_coin_purchase)
        .where(eq(vendor_coin_purchase.email, email!)),
    ])

    const total = totalResult[0]?.count ?? 0
    const totalPages = Math.ceil(total / limit)

    return c.json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    })
  } catch (error) {
    return c.json({ error })
  }
}

export const productBoostingHandler: RouteHandler<
  typeof productBoostingRoute
> = async (c) => {
  try {
    const { coins, endAt, productId } = c.req.valid("json")
    const getUser = c.get("user")

    if (!getUser) return c.json({ message: "Unauthorized" }, 401)

    const targetEndAt = new Date(endAt)
    const now = new Date()

    // 2. Validate duration and ratio (> 5 coins per second)
    const diffInSeconds = (targetEndAt.getTime() - now.getTime()) / 1000

    if (diffInSeconds <= 0) {
      return c.json({ error: "End date must be in the future." }, 400)
    }

    const getCoin = await db.query.vendor_coin.findFirst({
      where: eq(vendor_coin.email, getUser.email),
    })

    if ((getCoin?.coin ?? 0) < coins) {
      return c.json({ message: "You've not much coin" }, 400)
    }
    const product = await db.query.products.findFirst({
      where: and(
        eq(products.id, productId),
        eq(products.userEmail, getUser.email)
      ),
    })
    if (!product) {
      return c.json({ message: "Product not found or not owned by you" }, 403)
    }

    const existingActiveBoost = await db.query.product_boost.findFirst({
      where: and(
        eq(product_boost.productId, productId),
        eq(product_boost.userId, getUser.id),
        gt(product_boost.endAt, now)
      ),
    })
    let data

    if (existingActiveBoost) {
      // Extend existing boost
      const currentEndAt = new Date(existingActiveBoost.endAt!)
      const addedDurationMs = targetEndAt.getTime() - now.getTime()
      const newEndAt = new Date(currentEndAt.getTime() + addedDurationMs)
      ;[data] = await db
        .update(product_boost)
        .set({
          coins: existingActiveBoost.coins + coins,
          endAt: newEndAt,
        })
        .where(eq(product_boost.id, existingActiveBoost.id))
        .returning()
    } else {
      ;[data] = await db
        .insert(product_boost)
        .values({
          productId,
          userId: getUser.id,
          coins,
          endAt: targetEndAt,
        })
        .returning()
    }

    // todo: implements kafka
    if (data) {
      await db
        .update(vendor_coin)
        .set({
          coin: sql`${vendor_coin.coin} - ${coins}`,
        })
        .where(eq(vendor_coin.email, getUser.email))
    }
    return c.json({ data }, 200)
  } catch (error) {
    return c.json({ error: "Something went wrong" }, 500)
  }
}

export const getAllBoostedProductsHandler: RouteHandler<
  typeof getAllBoostedProductsRoute
> = async (c) => {
  try {
    const user = c.get("user")
    const { limit, page } = c.req.valid("query")
    const offset = (page - 1) * limit
    const [data, totalResult] = await Promise.all([
      db.query.product_boost.findMany({
        where: and(
          eq(product_boost.userId, user?.id!),
          gte(product_boost.endAt, new Date())
        ),
        orderBy: [desc(product_boost.createdAt)],
        limit,
        offset,
        with: { product: true },
      }),
      db
        .select({ count: count() })
        .from(product_boost)
        .where(
          and(
            eq(product_boost.userId, user?.id!),
            gte(product_boost.endAt, new Date())
          )
        ),
    ])
    const total = totalResult[0]?.count ?? 0
    const totalPages = Math.ceil(total / limit)

    return c.json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    })
  } catch (error) {
    return c.json({ message: "Something went wrong" }, 500)
  }
}
