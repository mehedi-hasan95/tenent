import {
  createConsumer,
  createKafkaClient,
  createProducer,
} from "@workspace/kafka"

const kafkaClient = createKafkaClient("payment-services")

export const producer = createProducer(kafkaClient)
export const consumer = createConsumer(kafkaClient, "payment-group")
