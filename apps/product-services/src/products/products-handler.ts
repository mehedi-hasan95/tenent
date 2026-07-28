import { RouteHandler } from "@workspace/open-api"
import { allProductsRoute, singleProductsRoute } from "./products-route"
import { Cursor, decodeCursor, encodeCursor } from "../utils/cursor"
import {
  and,
  db,
  desc,
  eq,
  getTableColumns,
  gt,
  isNull,
  lt,
  or,
  sql,
} from "@workspace/db"
import { products } from "@workspace/db/schema/products.schema"
import { productBoost } from "@workspace/db/schema/boosting.schema"

export const allProductsHandler: RouteHandler<typeof allProductsRoute> = async (
  c
) => {
  try {
    const { seller, pageSize, cursor: rawCursor } = c.req.valid("query")

    let cursor: Cursor | null = null
    if (rawCursor) {
      cursor = decodeCursor(rawCursor)
      if (!cursor) return c.json({ error: "Invalid cursor" }, 400)
    }

    const boostSq = db
      .select({
        productId: productBoost.productId,
        boostRate:
          sql<number>`max(${productBoost.coins} / (extract(epoch from (${productBoost.endAt} - ${productBoost.createdAt})) / 86400))`.as(
            "boost_rate"
          ),
      })
      .from(productBoost)
      .where(gt(productBoost.endAt, sql`now()`))
      .groupBy(productBoost.productId)
      .as("boost_sq")

    const boost = sql<number>`coalesce(${boostSq.boostRate}, 0)`

    const rows = await db
      .select({ ...getTableColumns(products), boost: boost.as("boost") })
      .from(products)
      .leftJoin(boostSq, eq(boostSq.productId, products.id))
      .where(
        and(
          eq(products.status, "active"),
          seller ? eq(products.userEmail, seller) : undefined,
          cursor
            ? or(
                lt(boost, cursor.boost),
                and(
                  eq(boost, cursor.boost),
                  lt(products.createdAt, cursor.createdAt)
                ),
                and(
                  eq(boost, cursor.boost),
                  eq(products.createdAt, cursor.createdAt),
                  lt(products.id, cursor.id)
                )
              )
            : undefined,
          isNull(products.deletedAt)
        )
      )
      .orderBy(desc(boost), desc(products.createdAt), desc(products.id))
      .limit(pageSize + 1)

    const hasMore = rows.length > pageSize
    const data = hasMore ? rows.slice(0, -1) : rows
    const last = data[data.length - 1]

    const nextCursor =
      hasMore && last
        ? encodeCursor({
            boost: last.boost,
            id: last.id,
            createdAt: last.createdAt,
          })
        : null

    return c.json({ data, nextCursor, hasMore }, 200)
  } catch (error) {
    console.error(error)
    return c.json({ error: "Something went wrong" }, 500)
  }
}
export const singleProductsHandler: RouteHandler<
  typeof singleProductsRoute
> = async (c) => {
  try {
    const { id } = c.req.valid("query")
    const data = await db.query.products.findFirst({
      where: eq(products.id, id),
    })
    return c.json({ data }, 200)
  } catch (error) {
    return c.json({ error: "Something went wrong" }, 500)
  }
}
