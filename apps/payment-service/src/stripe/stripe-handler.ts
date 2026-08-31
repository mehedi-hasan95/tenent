import { RouteHandler } from "@workspace/open-api"
import {
  retrieveStripeConnectRoute,
  stripeConnectRoute,
  stripeWebhookRoute,
} from "./stripe-route"
import Stripe from "stripe"
import { stripeClient } from "../utils/stripe-client"
import { db, eq } from "@workspace/db"
import { user } from "@workspace/db/schema/user.schema"
import { vendorCoinPurchaseAction } from "../actions/buy-coin-action"
import { producer } from "../utils/kafka"
import {
  buyProductsAction,
  updateProducts,
} from "../actions/buy-products-action"

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

  // const session = event.data.object as Stripe.Checkout.Session //used here for test
  // console.log(`Received event: ${event.type}`, "account:", event.account)
  switch (event.type) {
    case "account.updated":
      const account = event.data.object as Stripe.Account
      const isFullyOnboarded =
        account.charges_enabled &&
        account.payouts_enabled &&
        account.details_submitted
      // used kafka
      await producer.send("account.update", {
        value: JSON.stringify({ email: account?.email }),
      })
      // used kafka
      break

    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session
      //start: purchase coin for vendor start
      // used kafka
      if (session?.metadata?.user && session?.metadata?.coin) {
        await producer.send("vendor.coin", {
          value: JSON.stringify({
            email: session?.metadata?.user as string,
            price: Number(session?.metadata?.coin),
          }),
        })
      }
      // used kafka

      // used kafka: disabled this if kafka is used
      // if (session?.metadata?.user && session?.metadata?.coin) {
      //   await vendorCoinPurchaseAction({
      //     email: session?.metadata?.user as string,
      //     price: Number(session?.metadata?.coin),
      //   })
      // }
      //end: purchase coin for vendor end
      // start: Product purchase by user start

      if (session?.metadata?.email && session?.metadata?.orderId) {
        const address = session.collected_information?.shipping_details?.address
        //? if not used kafka
        // await buyProductsAction({
        //   city: address?.city as string,
        //   country: address?.country as string,
        //   email: session.customer_details?.email as string,
        //   id: session?.metadata?.orderId as string,
        //   line1: address?.line1 as string,
        //   paymentIntent: session.payment_intent as string,
        //   phone: address?.line2 as string,
        //   postalCode: address?.postal_code as string,
        //   state: address?.state as string,
        // })
        // await updateProducts(session?.metadata?.orderId as string)
        //? if not used kafka

        // used kafka
        await producer.send("products.purchase", {
          value: JSON.stringify({
            city: address?.city as string,
            country: address?.country as string,
            email: session.customer_details?.email as string,
            id: session?.metadata?.orderId as string,
            line1: address?.line1 as string,
            paymentIntent: session.payment_intent as string,
            phone: address?.line2 as string,
            postalCode: address?.postal_code as string,
            state: address?.state as string,
          }),
        })
        // used kafka
      }
      // end: Product purchase by user end
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
  try {
    const id = c.get("user")?.id
    if (!id) {
      return c.json({ message: undefined }, 401)
    }
    const getUser = await db.query.user.findFirst({ where: eq(user?.id, id) })

    if (!getUser?.stripeId) {
      return c.json({ message: "Stripe ID not found" }, 404)
    }
    if (getUser?.stripeVerified) {
      return c.json({ message: "Stripe is already connected" }, 400)
    }

    const linksAccount = await stripeClient.accountLinks.create({
      account: getUser?.stripeId,
      type: "account_onboarding",
      refresh_url: "http://localhost:3000",
      return_url: "http://localhost:3000",
    })
    return c.json({ data: linksAccount }, 200)
  } catch (error) {
    return c.json({ error })
  }
}

export const retrieveStripeConnectHandler: RouteHandler<
  typeof retrieveStripeConnectRoute
> = async (c) => {
  try {
    const details = c.get("user")
    const account = await db.query.user.findFirst({
      where: eq(user?.email, details?.email!),
    })
    if (account?.stripeVerified === false) {
      return c.json({ message: "Please connect your stripe" })
    }
    const data = await stripeClient.accounts.retrieve(account?.stripeId!)
    return c.json({ data }, 200)
  } catch (error) {
    return c.json({ message: "Something went wrong" }, 500)
  }
}
