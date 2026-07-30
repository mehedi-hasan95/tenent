import { RouteHandler } from "@workspace/open-api"
import { createOrderRoute } from "./orders-route"
import { db, inArray } from "@workspace/db"
import { products } from "@workspace/db/schema/products.schema"

export const createOrderHandler: RouteHandler<typeof createOrderRoute> = async (
  c
) => {
  try {
    const { ids } = c.req.valid("json")
    const findData = await db.query.products.findMany({
      where: inArray(products.id, ids),
    })
    return c.json({ findData })
  } catch (error) {
    return c.json({ message: "Something went wrong" }, 500)
  }
}
