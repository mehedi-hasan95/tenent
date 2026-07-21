import { RouteHandler } from "@workspace/open-api"
import {
  getActiveBoostingCoinRoute,
  vendorCoinPurchaseHistoryRoute,
  vendorCoinsRoute,
} from "./boosting-route"
import { count, db, desc, eq } from "@workspace/db"
import {
  boosting_coin,
  vendor_coin,
  vendor_coin_purchase,
} from "@workspace/db/schema/boosting.schema"

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
    return c.json({ data }, 200)
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
        orderBy: [desc(vendor_coin_purchase.created_at)],
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
