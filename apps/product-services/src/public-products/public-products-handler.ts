import { RouteHandler } from "@workspace/open-api"
import {
  allProductsRoute,
  boostedProductRoute,
  getArrayProductsRoute,
  popularProductsRoute,
  ratingAndReviewRoute,
  singleProductsRoute,
} from "./public-products-route"
import { Cursor, decodeCursor, encodeCursor } from "../utils/cursor"
import {
  and,
  asc,
  db,
  desc,
  eq,
  gte,
  ilike,
  inArray,
  isNull,
  lt,
  lte,
  ne,
  or,
  sql,
  sum,
} from "@workspace/db"
import { products } from "@workspace/db/schema/products.schema"
import { productBoost } from "@workspace/db/schema/boosting.schema"
import {
  boostingSubquery,
  ratingColumns,
  ratingSubquery,
} from "../utils/queries/rating-query"
import { orderItems, ratings } from "@workspace/db/schema/order.schema"
import { categories } from "@workspace/db/schema/categories.schema"
import { alias } from "drizzle-orm/pg-core"
import { user } from "@workspace/db/schema/user.schema"

export const allProductsHandler: RouteHandler<typeof allProductsRoute> = async (
  c
) => {
  try {
    const {
      seller,
      pageSize,
      cursor: rawCursor,
      search,
      maxPrice,
      minPrice,
      cats,
      sort,
    } = c.req.valid("query")

    let cursor: Cursor | null = null
    if (rawCursor) {
      cursor = decodeCursor(rawCursor)
      if (!cursor) return c.json({ error: "Invalid cursor" }, 400)
    }

    const getCats = cats?.length ? cats?.split(",") : undefined

    const boostSq = boostingSubquery()
    const ratingSq = ratingSubquery()

    const boost = sql<number>`coalesce(${boostSq.boostRate}, 0)`

    const rows = await db
      .select({
        products,
        boost: boost.as("boost"),

        ...ratingColumns(ratingSq),
      })
      .from(products)
      .leftJoin(boostSq, eq(boostSq.productId, products.id))
      .leftJoin(ratingSq, eq(ratingSq.productId, products.id))
      .where(
        and(
          eq(products.status, "active"),

          search ? ilike(products.title, `%${search}%`) : undefined,
          minPrice ? gte(products.salePrice, minPrice) : undefined,
          maxPrice ? lte(products.salePrice, maxPrice) : undefined,
          seller ? eq(products.userEmail, seller) : undefined,
          getCats && inArray(products.categorySlug, getCats),
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

export const popularProductsHandler: RouteHandler<
  typeof popularProductsRoute
> = async (c) => {
  try {
    const ratingSq = ratingSubquery()
    const data = await db
      .select({ products, ...ratingColumns(ratingSq) })
      .from(orderItems)
      .leftJoin(products, eq(orderItems.productId, products.id))
      .leftJoin(ratingSq, eq(ratingSq.productId, products.id))
      .groupBy(products.id, ratingSq.avgRating, ratingSq.ratingCount)
      .orderBy(desc(sum(orderItems.quantity)))
      .limit(10)
    return c.json({ data }, 200)
  } catch (error) {
    return c.json({ error }, 500)
  }
}

export const ratingAndReviewHandler: RouteHandler<
  typeof ratingAndReviewRoute
> = async (c) => {
  try {
    const { id } = c.req.valid("param")
    const ratingSeries = sql`generate_series(1, 5) AS s(rating)`

    const targetedProduct = alias(products, "targeted_product")
    const [rating, review, category] = await Promise.all([
      db
        .select({
          rating: sql<number>`s.rating`,
          count: sql<number>`count(${ratings.id})::int`,
          percentage: sql<number>`
            COALESCE(
              (count(${ratings.id})::float / NULLIF(sum(count(${ratings.id})) over(), 0)) * 100,
              0
            )
          `,
        })
        .from(ratingSeries)
        .leftJoin(
          ratings,
          sql`${ratings.rating} = s.rating AND ${ratings.productId} = ${id}`
        )
        .groupBy(sql`s.rating`)
        .orderBy(sql`s.rating DESC`),

      db
        .select({
          reviews: ratings.reviews,
          name: user.name,
          img: user.image ?? "https://github.com/shadcn.png",
          createdAt: ratings.createdAt,
          rating: ratings.rating,
        })
        .from(ratings)
        .innerJoin(user, eq(ratings.email, user.email))
        .where(eq(ratings.productId, id)),

      db
        .select()
        .from(products)
        .leftJoin(targetedProduct, eq(targetedProduct.id, id))
        .where(
          and(
            eq(products.categorySlug, targetedProduct.categorySlug),
            ne(products.id, id)
          )
        )
        .orderBy(sql`RANDOM()`)
        .limit(3),
    ])

    return c.json({ data: { rating, review, category } }, 200)
  } catch (error) {
    return c.json({ message: "Something went wrong" }, 500)
  }
}

export const getArrayProductsHandler: RouteHandler<
  typeof getArrayProductsRoute
> = async (c) => {
  try {
    const { ids } = c.req.valid("query")

    const ratingSq = ratingSubquery()
    const data = await db
      .select({ products, ...ratingColumns(ratingSq) })
      .from(products)
      .leftJoin(ratingSq, eq(ratingSq.productId, products.id))
      .where(inArray(products.id, ids))
    return c.json({ data }, 200)
  } catch (error) {
    return c.json({ message: "Something went wrong" }, 500)
  }
}
