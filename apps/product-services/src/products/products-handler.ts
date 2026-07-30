import { RouteHandler } from "@workspace/open-api"
import {
  allProductsRoute,
  boostedProductRoute,
  singleProductsRoute,
} from "./products-route"
import { Cursor, decodeCursor, encodeCursor } from "../utils/cursor"
import {
  and,
  db,
  desc,
  eq,
  getTableColumns,
  gt,
  gte,
  isNull,
  lt,
  or,
  sql,
} from "@workspace/db"
import { products } from "@workspace/db/schema/products.schema"
import { productBoost } from "@workspace/db/schema/boosting.schema"
import { ratings } from "@workspace/db/schema/order.schema"
import { ratingColumns, ratingSubquery } from "../utils/queries/rating-query"

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
    const ratingSq = db
      .select({
        productId: ratings.productId,
        avgRating: sql<number>`avg(${ratings.rating})`.as("avg_rating"),
        ratingCount: sql<number>`count(*)`.as("rating_count"),
      })
      .from(ratings)
      .groupBy(ratings.productId)
      .as("rating_sq")

    const boost = sql<number>`coalesce(${boostSq.boostRate}, 0)`

    const rows = await db
      .select({
        products,
        boost: boost.as("boost"),

        avgRating: sql<number | null>`
          ${ratingSq.avgRating}::float8
        `.as("avgRating"),

        ratingCount: sql<number | null>`
          ${ratingSq.ratingCount}::int
        `.as("ratingCount"),
      })
      .from(products)
      .leftJoin(boostSq, eq(boostSq.productId, products.id))
      .leftJoin(ratingSq, eq(ratingSq.productId, products.id))
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
            id: last.products.id,
            createdAt: last.products.createdAt,
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
    const ratingSq = ratingSubquery()

    const [data] = await db
      .select({ products, ...ratingColumns(ratingSq) })
      .from(products)
      .leftJoin(ratingSq, eq(ratingSq.productId, products.id))
      .where(eq(products.id, id))
    return c.json({ data }, 200)
  } catch (error) {
    return c.json({ error: "Something went wrong" }, 500)
  }
}

export const boostedProductHandler: RouteHandler<
  typeof boostedProductRoute
> = async (c) => {
  try {
    const ratingSq = ratingSubquery()
    const data = await db
      .select({
        productBoost,
        products,
        ...ratingColumns(ratingSq),
      })
      .from(productBoost)
      .leftJoin(products, eq(products.id, productBoost.productId))
      .leftJoin(ratingSq, eq(ratingSq.productId, products.id))
      .where(gte(productBoost.endAt, sql`now()`))
      .orderBy(
        desc(sql`
          ${productBoost.coins} /
          (extract(epoch from (${productBoost.endAt} - ${productBoost.createdAt})) / 86400.0)
        `)
      )

    return c.json({ data }, 200)
  } catch (error) {
    return c.json({ message: "Something went wrong" }, 500)
  }
}
