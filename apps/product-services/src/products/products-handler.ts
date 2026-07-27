import { RouteHandler } from "@workspace/open-api"
import { allProductsRoute, singleProductsRoute } from "./products-route"
import { Cursor, decodeCursor, encodeCursor } from "../utils/cursor"
import { and, db, eq, gt, isNull, lt, or } from "@workspace/db"
import { products } from "@workspace/db/schema/products.schema"

export const allProductsHandler: RouteHandler<typeof allProductsRoute> = async (
  c
) => {
  try {
    const {
      seller,
      pageSize,
      cursor: rawCursor,
      productStatus,
    } = c.req.valid("query")

    let cursor: Cursor | null = null
    if (rawCursor) {
      cursor = decodeCursor(rawCursor)
      if (!cursor) {
        return c.json({ error: "Invalid cursor" }, 400)
      }
    }

    const rows = await db.query.products.findMany({
      where: and(
        productStatus ? eq(products.status, productStatus) : undefined,
        seller ? eq(products.userEmail, seller) : undefined,
        cursor
          ? or(
              lt(products.createdAt, cursor.createdAt),
              and(
                eq(products.createdAt, cursor.createdAt),
                lt(products.id, cursor.id)
              )
            )
          : undefined,
        isNull(products.deleted_at)
      ),
      limit: pageSize + 1,
      orderBy: (products, { desc }) => [
        desc(products.createdAt),
        desc(products.id),
      ],
    })

    const hasMore = rows.length > pageSize
    const data = hasMore ? rows.slice(0, -1) : rows

    const last = data[data.length - 1]
    const nextCursor =
      hasMore && last
        ? encodeCursor({ id: last.id, createdAt: last.createdAt })
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
