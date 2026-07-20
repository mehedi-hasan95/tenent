import { db, eq, sql } from "@workspace/db"
import {
  boosting_coin,
  vendor_coin,
  vendor_coin_purchase,
} from "@workspace/db/schema/boosting.schema"

export const vendorCoinPurchaseAction = async ({
  email,
  price,
}: {
  email: string
  price: number
}) => {
  try {
    const data = await db.query.boosting_coin.findFirst({
      where: eq(boosting_coin.is_active, true),
    })
    const coin = data?.coin! * price
    await db.transaction(async (tx) => {
      const [purchase] = await tx
        .insert(vendor_coin_purchase)
        .values({ email, coin, price })
        .returning()
      const [existing] = await tx
        .insert(vendor_coin)
        .values({ email, coin })
        .onConflictDoUpdate({
          target: vendor_coin.email,
          set: { coin: sql`COALESCE(${vendor_coin.coin}, 0) + EXCLUDED.coin` },
        })
        .returning()
      return { purchase, existing }
    })
  } catch (error) {
    return { message: "Something went wrong" }
  }
}
