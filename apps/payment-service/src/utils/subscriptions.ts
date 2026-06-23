import { consumer } from "./kafka"
import { stripeClient } from "./stripe-client"

export const runKafkaSubscriptions = async () => {
  consumer.subscribe([
    {
      topicName: "create.stripe",
      topicHandler: async (message) => {
        const activity = JSON.parse(message.value.toString())
        console.log(activity)
        // const createAccount = await stripeClient.accounts.create({
        //   email: activity.email,
        //   type: "express",
        // })
        // console.log("createAccount: ", createAccount)
      },
    },
  ])
}
