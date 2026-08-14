import { and, db, eq } from "@workspace/db"
import { orders } from "@workspace/db/schema/order.schema"

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
