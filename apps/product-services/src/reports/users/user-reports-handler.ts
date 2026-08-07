import { RouteHandler } from "@workspace/open-api"
import { userAllOrdersRoute } from "./user-reports-route"
import { count, db, desc, eq } from "@workspace/db"
import { orderItems, orders } from "@workspace/db/schema/order.schema"
import { products } from "@workspace/db/schema/products.schema"

export const userAllOrdersHandler: RouteHandler<
  typeof userAllOrdersRoute
> = async (c) => {
  try {
    const email = c.get("user")?.email
    const { limit, page } = c.req.valid("query")
    const offset = (page - 1) * limit

    const [data, totalResult] = await Promise.all([
      // db.query.orders.findMany({
      //   where: eq(orders.email, email!),
      //   with: {
      //     orderItems: {
      //       with: { product: { columns: { title: true, images: true } } },
      //     },
      //   },
      //   orderBy: [desc(orders.createdAt)],
      //   limit,
      //   offset,
      // }),
      db
        .select({
          orderItems: orderItems,
          orders: orders,
          products: { title: products.title, images: products.images },
        })
        .from(orderItems)
        .innerJoin(orders, eq(orderItems.orderId, orders.id))
        .innerJoin(products, eq(orderItems.productId, products.id))
        .where(eq(orders.email, email!))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: count() })
        .from(orderItems)
        .innerJoin(orders, eq(orderItems.orderId, orders.id))
        .where(eq(orders.email, email!)),
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
