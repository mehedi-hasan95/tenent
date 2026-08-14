import z from "zod"

export const orderStatusEnum = z.enum([
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
])
