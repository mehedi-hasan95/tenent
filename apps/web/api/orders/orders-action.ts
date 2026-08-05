import z from "zod"
import { createStripeOrderValidator } from "@workspace/validators/validators/order-validators"

export const createStripeOrderAction = async (
  orders: z.input<typeof createStripeOrderValidator>
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PAYMENT_URL}/orders/create-order`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(orders),
    }
  )
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  const data = await response.json()
  return data.data as string
}
