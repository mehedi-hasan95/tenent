import { consumer } from "./kafka"

export const runKafkaSubscriptions = async () => {
  consumer.subscribe([])
}
