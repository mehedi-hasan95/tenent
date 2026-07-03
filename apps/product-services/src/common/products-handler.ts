import { RouteHandler } from "@workspace/open-api"
import { allProductsRoute } from "./products-route"
import { Cursor, decodeCursor, encodeCursor } from "../utils/cursor"
import { and, db, eq, gt, lt, or } from "@workspace/db"
import { products } from "@workspace/db/schema/products.schema"

export const allProductsHandler: RouteHandler<typeof allProductsRoute> = async (
  c
) => {
  try {
    const { seller, pageSize, cursor: rawCursor } = c.req.valid("query")

    let cursor: Cursor | null = null
    if (rawCursor) {
      cursor = decodeCursor(rawCursor)
      if (!cursor) {
        return c.json({ error: "Invalid cursor" }, 400)
      }
    }

    const rows = await db.query.products.findMany({
      where: and(
        seller ? eq(products.userEmail, seller) : undefined,
        cursor
          ? or(
              lt(products.created_at, cursor.createdAt),
              and(
                eq(products.created_at, cursor.createdAt),
                lt(products.id, cursor.id)
              )
            )
          : undefined
      ),
      limit: pageSize + 1,
      orderBy: (products, { desc }) => [
        desc(products.created_at),
        desc(products.id),
      ],
    })

    const hasMore = rows.length > pageSize
    const data = hasMore ? rows.slice(0, -1) : rows

    const last = data[data.length - 1]
    const nextCursor =
      hasMore && last
        ? encodeCursor({ id: last.id, createdAt: last.created_at })
        : null

    return c.json({ data, nextCursor, hasMore }, 200)
  } catch (error) {
    console.error(error)
    return c.json({ error: "Something went wrong" }, 500)
  }
}
