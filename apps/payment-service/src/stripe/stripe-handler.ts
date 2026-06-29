import { RouteHandler } from "@workspace/open-api"
import { stripeConnectRoute, stripeWebhookRoute } from "./stripe-route"
import Stripe from "stripe"
import { stripeClient } from "../utils/stripe-client"
import { db, eq } from "@workspace/db"
import { user } from "@workspace/db/schema/user.schema"

export const stripeWebhookHandler: RouteHandler<
  typeof stripeWebhookRoute
> = async (c) => {
  const body = await c.req.text()
  const sig = c.req.header("stripe-signature")
  if (!sig) {
    return c.json({ error: "Missing stripe-signature header" }, 400)
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
  let event: Stripe.Event

  try {
    event = stripeClient.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return c.json(
      { error: `Webhook signature verification failed: ${message}` },
      400
    )
  }
  switch (event.type) {
    case "account.updated":
      const account = event.data.object as Stripe.Account
      console.log(account)
      break

    default:
      console.log(`Unhandled event type: ${event.type}`)
      break
  }
  return c.json({ received: true }, 200)
}

export const stripeConnectHandler: RouteHandler<
  typeof stripeConnectRoute
> = async (c) => {
  const id = c.get("user")?.id
  if (!id) {
    return c.json({ message: undefined }, 401)
  }
  const getUser = await db.query.user.findFirst({ where: eq(user?.id, id) })

  if (!getUser?.stripeId) {
    return c.json({ message: "Stripe ID not found" }, 404)
  }

  const linksAccount = await stripeClient.accountLinks.create({
    account: getUser?.stripeId,
    type: "account_onboarding",
    refresh_url: "http://localhost:3000",
    return_url: "http://localhost:3000",
  })
  return c.json({ data: linksAccount }, 200)
}
