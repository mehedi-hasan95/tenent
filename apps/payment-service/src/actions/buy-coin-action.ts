import { db, eq, sql } from "@workspace/db"
import {
  boostingCoin,
  vendorCoin,
  vendorCoinPurchase,
} from "@workspace/db/schema/boosting.schema"

export const vendorCoinPurchaseAction = async ({
  email,
  price,
}: {
  email: string
  price: number
}) => {
  try {
    const data = await db.query.boostingCoin.findFirst({
      where: eq(boostingCoin.isActive, true),
    })
    const coin = data?.coin! * price
    await db.transaction(async (tx) => {
      const [purchase] = await tx
        .insert(vendorCoinPurchase)
        .values({ email, coin, price })
        .returning()
      const [existing] = await tx
        .insert(vendorCoin)
        .values({ email, coin })
        .onConflictDoUpdate({
          target: vendorCoin.email,
          set: { coin: sql`COALESCE(${vendorCoin.coin}, 0) + EXCLUDED.coin` },
        })
        .returning()
      return { purchase, existing }
    })
  } catch (error) {
    return { message: "Something went wrong" }
  }
}
