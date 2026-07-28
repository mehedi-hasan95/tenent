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
  boostingCoin,
  productBoost,
  vendorCoin,
  vendorCoinPurchase,
} from "@workspace/db/schema/boosting.schema"
import { products } from "@workspace/db/schema/products.schema"

export const getActiveBoostingCoinHandler: RouteHandler<
  typeof getActiveBoostingCoinRoute
> = async (c) => {
  try {
    const data = await db.query.boostingCoin.findFirst({
      where: eq(boostingCoin.isActive, true),
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
    const data = await db.query.vendorCoin.findFirst({
      where: eq(vendorCoin.email, email!),
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
      db.query.vendorCoinPurchase.findMany({
        where: eq(vendorCoinPurchase.email, email!),
        orderBy: [desc(vendorCoinPurchase.createdAt)],
        limit,
        offset,
      }),
      db
        .select({ count: count() })
        .from(vendorCoinPurchase)
        .where(eq(vendorCoinPurchase.email, email!)),
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

    const getCoin = await db.query.vendorCoin.findFirst({
      where: eq(vendorCoin.email, getUser.email),
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

    const existingActiveBoost = await db.query.productBoost.findFirst({
      where: and(
        eq(productBoost.productId, productId),
        eq(productBoost.userId, getUser.id),
        gt(productBoost.endAt, now)
      ),
    })
    let data

    if (existingActiveBoost) {
      // Extend existing boost
      const currentEndAt = new Date(existingActiveBoost.endAt!)
      const addedDurationMs = targetEndAt.getTime() - now.getTime()
      const newEndAt = new Date(currentEndAt.getTime() + addedDurationMs)
      ;[data] = await db
        .update(productBoost)
        .set({
          coins: existingActiveBoost.coins + coins,
          endAt: newEndAt,
        })
        .where(eq(productBoost.id, existingActiveBoost.id))
        .returning()
    } else {
      ;[data] = await db
        .insert(productBoost)
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
        .update(vendorCoin)
        .set({
          coin: sql`${vendorCoin.coin} - ${coins}`,
        })
        .where(eq(vendorCoin.email, getUser.email))
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
      db.query.productBoost.findMany({
        where: and(
          eq(productBoost.userId, user?.id!),
          gte(productBoost.endAt, new Date())
        ),
        orderBy: [desc(productBoost.createdAt)],
        limit,
        offset,
        with: { product: true },
      }),
      db
        .select({ count: count() })
        .from(productBoost)
        .where(
          and(
            eq(productBoost.userId, user?.id!),
            gte(productBoost.endAt, new Date())
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
