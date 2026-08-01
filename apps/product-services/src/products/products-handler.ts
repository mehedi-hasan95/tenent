import { RouteHandler } from "@workspace/open-api"
import {
  allProductsRoute,
  boostedProductRoute,
  singleProductsRoute,
} from "./products-route"
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
  or,
  sql,
} from "@workspace/db"
import { products } from "@workspace/db/schema/products.schema"
import { productBoost } from "@workspace/db/schema/boosting.schema"
import {
  boostingSubquery,
  ratingColumns,
  ratingSubquery,
} from "../utils/queries/rating-query"

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

    const orderBy =
      sort === "ascByName"
        ? [asc(products.title)]
        : sort === "dscByName"
          ? [desc(products.title)]
          : sort === "ascByPrice"
            ? [asc(products.salePrice)]
            : sort === "dscByPrice"
              ? [desc(products.salePrice)]
              : sort === "new"
                ? [desc(products.createdAt)]
                : sort === "old"
                  ? [asc(products.createdAt)]
                  : [desc(boost), desc(products.createdAt), desc(products.id)]

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
      // .orderBy(desc(boost), desc(products.createdAt), desc(products.id))
      .orderBy(...orderBy)
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
