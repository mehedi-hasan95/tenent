import {
  createConsumer,
  createKafkaClient,
  createProducer,
} from "@workspace/kafka"

const kafkaClient = createKafkaClient("admin-services")

export const producer = createProducer(kafkaClient)
export const consumer = createConsumer(kafkaClient, "admin-group")
