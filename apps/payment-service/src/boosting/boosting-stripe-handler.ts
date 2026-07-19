import { RouteHandler } from "@workspace/open-api"
import { stripeClient } from "../utils/stripe-client"
import { buyCoinRoute } from "./boosting-stripe-route"

export const buyCoinHandler: RouteHandler<typeof buyCoinRoute> = async (c) => {
  const { coin } = c.req.valid("json")
  const email = c.get("user")?.email

  try {
    const session = await stripeClient.checkout.sessions.create({
      ui_mode: "elements",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${coin} Coins`,
            },
            unit_amount: coin * 100, // cents
          },
          quantity: 1,
        },
      ],
      payment_method_types: ["card"],
      customer_email: email,
      mode: "payment",
      metadata: {
        coin,
        user: email!,
      },
      return_url: `http://localhost:3000/complete?session_id={CHECKOUT_SESSION_ID}`,
    })
    return c.json({ data: session.client_secret })
  } catch (error) {
    return c.json({ error })
  }
}
