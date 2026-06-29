import { db, eq } from "@workspace/db"
import { consumer } from "./kafka"
import { stripeClient } from "./stripe-client"
import { user } from "@workspace/db/schema/user.schema"

export const runKafkaSubscriptions = async () => {
  consumer.subscribe([
    {
      topicName: "create.stripe",
      topicHandler: async (message) => {
        const activity = JSON.parse(message.value.toString())

        const createAccount = await stripeClient.v2.core.accounts.create({
          contact_email: activity.email,
        })
        await db
          .update(user)
          .set({ stripeId: createAccount.id })
          .where(eq(user.email, activity.email))
          .returning()
      },
    },
  ])
}
