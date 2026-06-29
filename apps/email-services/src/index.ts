import { createConsumer, createKafkaClient } from "@workspace/kafka"
import { sendVerificationEmail } from "./auth-email/send-verification-email"

const kafka = createKafkaClient("email-service")
const consumer = createConsumer(kafka, "email-service")

const start = async () => {
  try {
    await consumer.connect()
    await consumer.subscribe([
      {
        topicName: "verification.email",
        topicHandler: async (message) => {
          const activity = JSON.parse(message.value.toString())
          await sendVerificationEmail(
            activity.type,
            activity.email,
            activity.otp
          )
        },
      },
    ])
  } catch (error) {
    console.log(error)
  }
}
start()
