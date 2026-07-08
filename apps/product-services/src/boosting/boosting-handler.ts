import { RouteHandler } from "@workspace/open-api"
import { getActiveBoostingCoinRoute } from "./boosting-route"
import { db, eq } from "@workspace/db"
import { boosting_coin } from "@workspace/db/schema/boosting.schema"

export const getActiveBoostingCoinHandler: RouteHandler<
  typeof getActiveBoostingCoinRoute
> = async (c) => {
  try {
    const data = await db.query.boosting_coin.findFirst({
      where: eq(boosting_coin.is_active, true),
    })
    return c.json({ data }, 200)
  } catch (error) {
    return c.json({ message: "Something went wrong" }, 500)
  }
}
