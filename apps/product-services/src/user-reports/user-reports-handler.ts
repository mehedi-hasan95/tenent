import { RouteHandler } from "@workspace/open-api"
import {
  addRatingRoute,
  getAllRatingsRoute,
  getSingleOrderRoute,
  userAllOrdersRoute,
} from "./user-reports-route"
import { and, count, db, desc, eq } from "@workspace/db"
import { orderItems, orders, ratings } from "@workspace/db/schema/order.schema"
import { products } from "@workspace/db/schema/products.schema"

export const userAllOrdersHandler: RouteHandler<
  typeof userAllOrdersRoute
> = async (c) => {
  try {
    const email = c.get("user")?.email
    const { limit, page } = c.req.valid("query")
    const offset = (page - 1) * limit

    const [data, totalResult] = await Promise.all([
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

export const getSingleOrderHandler: RouteHandler<
  typeof getSingleOrderRoute
> = async (c) => {
  try {
    const email = c.get("user")?.email
    const { id } = c.req.valid("param")
    const [data] = await db
      .select({
        orderItems,
        orders,
        products: { title: products.title, images: products.images },
      })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(and(eq(orderItems.id, id), eq(orders.email, email!)))

    return c.json({ data }, 200)
  } catch (error) {
    return c.json({ error }, 500)
  }
}

export const addRatingHandler: RouteHandler<typeof addRatingRoute> = async (
  c
) => {
  try {
    const { orderId, productId, rating, reviews } = c.req.valid("json")
    const email = c.get("user")?.email
    const [order] = await db
      .select({
        orderItem: orderItems,
        order: { email: orders.email },
      })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(
        and(
          eq(orderItems.orderId, orderId),
          eq(orderItems.productId, productId),
          eq(orders.email, email!)
        )
      )
      .limit(1)
    if (!order) {
      return c.json({
        message:
          "You're not the author of this order or orderId or productId isn't match",
      })
    }
    const expiredDate = new Date()
    expiredDate.setDate(expiredDate.getDate() - 30)

    if (order.orderItem.createdAt < expiredDate) {
      return c.json(
        { message: "You can only rate an order within 30 days of purchase" },
        400
      )
    }

    const data = await db
      .insert(ratings)
      .values({ orderId, productId, rating, reviews, email: email! })
      .returning()

    return c.json({ data }, 200)
  } catch (error) {
    if (
      error instanceof Error &&
      (error.cause as { code?: string })?.code === "23505"
    ) {
      return c.json({ message: "You already add rating & reviews" }, 409)
    }
    return c.json({ message: "Something went wrong" }, 500)
  }
}

export const getAllRatingsHandler: RouteHandler<
  typeof getAllRatingsRoute
> = async (c) => {
  try {
    const email = c.get("user")?.email
    const data = await db
      .select({
        ratings,
        product: { title: products.title, image: products.images },
      })
      .from(ratings)
      .leftJoin(products, eq(ratings.productId, products.id))
      .where(eq(ratings.email, email!))
      .orderBy(desc(ratings.createdAt))
    return c.json({ data }, 200)
  } catch (error) {
    return c.json({ message: "Something went wrong" }, 500)
  }
}
