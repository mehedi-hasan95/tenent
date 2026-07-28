import z from "zod"
import { customError } from "./constructor"

export const boostingCoin = z.object({
  coin: z.coerce.number().min(1).nonnegative(),
})

export const productBoostingValidator = z
  .object({
    productId: z.string().nonempty({ message: "Please select a product" }),
    coins: z.coerce.number().min(1).nonnegative(),
    endAt: z.coerce.date(),
  })
  .superRefine(({ coins, endAt }, ctx) => {
    const now = new Date()

    const days = Math.ceil(
      (endAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    )

    const requiredCoins = days * 5

    if (coins < requiredCoins) {
      ctx.addIssue({
        code: customError,
        path: ["coins"],
        message: `At least ${requiredCoins} coins are required for ${days} day(s).`,
      })
    }
  })
