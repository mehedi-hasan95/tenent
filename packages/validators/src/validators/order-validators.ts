import z, { email } from "zod"
import { orderStatusEnum } from "../@types/enum.types"

export const orderValidators = z.object({
  email: z.string(),
  totalPrice: z.coerce.number(),
  isPaid: z.coerce.boolean(),
  paymentIntent: z.string().max(255).optional(),
  line1: z.string().max(255).optional(),
  postalCode: z.string().max(50).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  phone: z.string().max(30).optional(),
  country: z.string().max(100).optional(),
})

export const orderItemsValidator = z.object({
  productId: z.string(),
  price: z.coerce.number().nonnegative(),
  quantity: z.coerce.number().int().nonnegative(),
  size: z.string().max(50).optional(),
  color: z.string().max(50).optional(),
  usedCoupon: z.coerce.boolean(),
  status: orderStatusEnum.default("PROCESSING"),
  orderId: z.string(),
})

export const ratingsValidator = z.object({
  productId: z.string(),
  orderId: z.string(),
  email: z.email(),
  rating: z.coerce.number().int().positive(),
  reviews: z.string().max(400).optional(),
})
