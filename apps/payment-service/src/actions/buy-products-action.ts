import { and, db, eq, sql } from "@workspace/db"
import { orderItems, orders } from "@workspace/db/schema/order.schema"
import { products } from "@workspace/db/schema/products.schema"

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
  })
  await db.transaction(async (tx) => {
    for (const order of orders) {
      await tx
        .update(products)
        .set({ totalSale: sql`${products.totalSale}+${order.quantity}` })
        .where(eq(products.id, order.productId))
        .returning()
    }
  })
}
