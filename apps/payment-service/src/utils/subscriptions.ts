import { db, eq } from "@workspace/db"
import { consumer } from "./kafka"
import { stripeClient } from "./stripe-client"
import { user } from "@workspace/db/schema/user.schema"
import { vendorCoinPurchaseAction } from "../actions/buy-coin-action"
import {
  buyProductsAction,
  updateProducts,
} from "../actions/buy-products-action"

export const runKafkaSubscriptions = async () => {
  consumer.subscribe([
    {
      topicName: "create.stripe",
      topicHandler: async (message) => {
        const activity = JSON.parse(message.value.toString())

        const createAccount = await stripeClient.accounts.create({
          email: activity.email,
          type: "express",
        })
        await db
          .update(user)
          .set({ stripeId: createAccount.id })
          .where(eq(user.email, activity.email))
          .returning()
      },
    },

    {
      topicName: "vendor.coin",
      topicHandler: async (message) => {
        const activity = JSON.parse(message.value.toString())
        await vendorCoinPurchaseAction({
          email: activity.email,
          price: activity.price,
        })
      },
    },

    {
      topicName: "account.update",
      topicHandler: async (message) => {
        const activity = JSON.parse(message.value.toString())
        await db
          .update(user)
          .set({ stripeVerified: true })
          .where(eq(user.email, activity.email))
          .returning()
      },
    },
    {
      topicName: "products.purchase",
      topicHandler: async (message) => {
        const activity = JSON.parse(message.value.toString())
        await Promise.all([
          buyProductsAction({
            city: activity?.city,
            country: activity?.country,
            email: activity.email,
            id: activity.id,
            line1: activity?.line1,
            paymentIntent: activity.payment_intent,
            phone: activity?.line2,
            postalCode: activity?.postal_code,
            state: activity?.state,
          }),
          updateProducts(activity.id),
        ])
      },
    },
  ])
}
