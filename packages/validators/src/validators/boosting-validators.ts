import z from "zod"

export const boostingCoin = z.object({
  coin: z.coerce.number().int().nonnegative(),
})
