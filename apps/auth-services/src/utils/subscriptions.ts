import { consumer } from "./kafka"

export const runKafkaSubscriptions = async () => {
  consumer.subscribe([
    // {
    //   topicName: "verification.email",
    //   topicHandler: async (message) => {
    //     const activity = JSON.parse(message.value.toString())
    //     console.log(activity)
    //   },
    // },
  ])
}
