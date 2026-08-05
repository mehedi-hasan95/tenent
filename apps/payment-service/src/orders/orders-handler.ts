import { RouteHandler } from "@workspace/open-api"
import { createOrderRoute, retrieveOrderRoute } from "./orders-route"
import { db, inArray } from "@workspace/db"
import { products } from "@workspace/db/schema/products.schema"
import Stripe from "stripe"
import { stripeClient } from "../utils/stripe-client"
import { orderItems, orders } from "@workspace/db/schema/order.schema"
import { orderItemsValidator } from "@workspace/validators/validators/order-validators"
import z from "zod"

export const createOrderHandler: RouteHandler<typeof createOrderRoute> = async (
  c
) => {
  try {
    const email = c.get("user")?.email
    const { order } = c.req.valid("json")
    if (!order.length) {
      return c.json({ message: "Order cannot be empty" }, 400)
    }
    const productIds = order.map((item) => item.id)

    const product = await db
      .select({
        id: products.id,
        price: products.salePrice,
        inStoke: products.stock,
      })
      .from(products)
      .where(inArray(products.id, productIds))

    const productMap = new Map(product.map((p) => [p.id, p]))
    const modifiedOrder: z.infer<typeof orderItemsValidator>[] = []
    const seenIds = new Set<string>()
    let calculatedTotalPrice = 0

    for (const item of order) {
      if (seenIds.has(item.id)) {
        continue
      }
      seenIds.add(item.id)

      const p = productMap.get(item.id)
      if (!p) {
        return c.json({ message: `Product ${item.id} not found` }, 404)
      }
      if (item.quantity > p.inStoke) {
        return c.json(
          {
            message: `Only ${p.inStoke} unit(s) left for product ${item.id}`,
          },
          400
        )
      }

      const finalPrice = item.usedCoupon ? p.price * 0.9 : p.price
      calculatedTotalPrice += finalPrice * item.quantity
      modifiedOrder.push({
        productId: item.id,
        quantity: item.quantity,
        price: finalPrice,
        usedCoupon: item.usedCoupon,
        size: item.size,
        color: item.color,
        orderId: "",
      })
    }

    const insertedOrder = await db.transaction(async (tx) => {
      const [order] = await tx
        .insert(orders)
        .values({
          email: email!,
          totalPrice: calculatedTotalPrice,
        })
        .returning()

      if (!order) {
        throw new Error("Failed to create order")
      }

      await tx.insert(orderItems).values(
        modifiedOrder.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          price: item.price,
          quantity: item.quantity,
          usedCoupon: item.usedCoupon,
          size: item.size,
          color: item.color,
        }))
      )

      return order
    })
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
      modifiedOrder.map((item) => ({
        price_data: {
          currency: "usd",
          unit_amount: item.price * 100,
          product_data: {
            name: item.productId,
          },
        },

        quantity: item.quantity,
      }))
    const session = await stripeClient.checkout.sessions.create({
      ui_mode: "elements",
      payment_method_types: ["card"],
      customer_email: email,
      line_items,
      mode: "payment",
      metadata: {
        orderId: insertedOrder.id,
        email: email!,
      },
      return_url: `http://localhost:3000/complete?session_id={CHECKOUT_SESSION_ID}`,
    })

    return c.json({ data: session.client_secret })
  } catch (error) {
    return c.json({ message: "Something went wrong" }, 500)
  }
}

export const retrieveOrderHandler: RouteHandler<
  typeof retrieveOrderRoute
> = async (c) => {
  try {
    const { id } = c.req.valid("query")
    const session = await stripeClient.checkout.sessions.retrieve(id, {
      expand: ["line_items"],
    })
    return c.json({
      status: session.status,
      paymentStatus: session.payment_status,
      products: session.line_items,
    })
  } catch (error) {
    return c.json({ error }, 500)
  }
}
