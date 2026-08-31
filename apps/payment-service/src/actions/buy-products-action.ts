import { and, db, eq, sql } from "@workspace/db"
import { orderItems, orders } from "@workspace/db/schema/order.schema"
import { coupons, products } from "@workspace/db/schema/products.schema"
import { stripeClient } from "../utils/stripe-client"

export const buyProductsAction = async ({
  id,
  email,
  paymentIntent,
  city,
  country,
  line1,
  phone,
  postalCode,
  state,
}: {
  id: string
  email: string
  paymentIntent: string
  city: string
  country: string
  line1: string
  phone: string
  postalCode: string
  state: string
}) => {
  await db
    .update(orders)
    .set({
      paymentIntent,
      isPaid: true,
      city,
      country,
      line1,
      phone,
      postalCode,
      state,
    })
    .where(and(eq(orders.email, email), eq(orders.id, id)))
    .returning()
}

export const updateProducts = async (id: string) => {
  const orders = await db.query.orderItems.findMany({
    where: eq(orderItems.orderId, id),
    with: { product: { with: { user: { columns: { stripeId: true } } } } },
  })
  await db.transaction(async (tx) => {
    for (const order of orders) {
      await Promise.all([
        tx
          .update(products)
          .set({ totalSale: sql`${products.totalSale}+${order.quantity}` })
          .where(eq(products.id, order.productId))
          .returning(),
        order.usedCoupon &&
          tx
            .update(coupons)
            .set({ timesRedeemed: sql`${coupons.timesRedeemed}+1` }),
      ])
    }

    // send money to the vendor
    const sellers = new Map<
      string,
      {
        amount: number
        total: number
        orderIds: string[]
        productIds: string[]
      }
    >()

    for (const order of orders) {
      const stripeId = order.product.user.stripeId
      if (!stripeId) continue

      const total = order.price * order.quantity
      const sellerAmount = Math.round(total * 0.9 * 100)

      const existing = sellers.get(stripeId)

      if (existing) {
        existing.amount += sellerAmount
        existing.total += total
        if (!existing.orderIds.includes(order.orderId)) {
          existing.orderIds.push(order.orderId)
        }
        existing.productIds.push(order.productId)
      } else {
        sellers.set(stripeId, {
          amount: sellerAmount,
          total,
          orderIds: [order.orderId],
          productIds: [order.productId],
        })
      }
    }

    for (const [stripeId, seller] of sellers) {
      await stripeClient.transfers.create({
        amount: seller.amount,
        currency: "usd",
        destination: stripeId,
        description: `Payout for order ${id}`,
        metadata: {
          orderId: id,
          orderIds: seller.orderIds.join(","),
          productIds: seller.productIds.join(","),
          totalAmount: seller.total.toFixed(2),
          platformFee: (seller.total * 0.1).toFixed(2),
          sellerAmount: (seller.amount / 100).toFixed(2),
        },
      })
    }
  })
}
