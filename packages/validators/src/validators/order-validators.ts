import z from "zod"

export const shippingFormSchema = z.object({
  line1: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  phone: z.string().regex(/^\+?\d+$/, {
    message: "Phone number must contain only digits and an optional leading +",
  }),
  country: z.string(),
})
export const orderValidators = z.object({
  email: z.email(),
  totalPrice: z.coerce.number(),
  isPaid: z.coerce.boolean(),
  paymentIntent: z.string().max(255).optional(),
  ...shippingFormSchema,
})

export const orderItemsValidator = z.object({
  productId: z.string(),
  price: z.coerce.number().nonnegative(),
  quantity: z.coerce.number().int().nonnegative(),
  size: z.string().max(50).nullable(),
  color: z.string().max(50).nullable(),
  usedCoupon: z.coerce.boolean(),
  orderId: z.string(),
})

export const ratingsValidator = z.object({
  productId: z.string(),
  orderId: z.string(),
  email: z.email(),
  rating: z.coerce.number().int().positive(),
  reviews: z.string().max(400).optional(),
})

export const createStripeOrderValidator = z.object({
  order: z.array(
    z.object({
      id: z.string(),
      quantity: z.coerce.number().int().positive(),
      usedCoupon: z.boolean(),
      size: z.string().nullable(),
      color: z.string().nullable(),
    })
  ),
})
