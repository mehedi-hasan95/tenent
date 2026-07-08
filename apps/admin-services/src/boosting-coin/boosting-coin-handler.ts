import { RouteHandler } from "@workspace/open-api"
import {
  allBoostingCoinRoute,
  createBoostingCoinRoute,
  setActiveBoostingCoinRoute,
} from "./boosting-coin-route"
import { asc, db, eq } from "@workspace/db"
import { boosting_coin } from "@workspace/db/schema/boosting.schema"

export const createBoostingCoinHandler: RouteHandler<
  typeof createBoostingCoinRoute
> = async (c) => {
  try {
    const { coin } = c.req.valid("json")
    const [data] = await db.insert(boosting_coin).values({ coin }).returning()
    return c.json({ data }, 200)
  } catch (error) {
    return c.json({ message: "Something went wrong" }, 500)
  }
}

export const setActiveBoostingCoinHandler: RouteHandler<
  typeof setActiveBoostingCoinRoute
> = async (c) => {
  try {
    const { id } = c.req.valid("json")

    const activeCoin = await db.query.boosting_coin.findFirst({
      where: eq(boosting_coin.id, id),
      columns: {
        is_active: true,
      },
    })

    if (!activeCoin) {
      return c.json({ message: "Plan not found" }, 404)
    }

    if (activeCoin.is_active) {
      return c.json({ message: "Plan already active" }, 201)
    }

    const currentActive = await db.query.boosting_coin.findFirst({
      where: eq(boosting_coin.is_active, true),
      columns: {
        id: true,
      },
    })

    if (currentActive) {
      await db
        .update(boosting_coin)
        .set({ is_active: false })
        .where(eq(boosting_coin.id, currentActive.id))
    }

    await db
      .update(boosting_coin)
      .set({ is_active: true })
      .where(eq(boosting_coin.id, id))

    return c.json({ message: "New plan activated" }, 200)
  } catch (error) {
    return c.json({ message: "Something went wrong" }, 500)
  }
}

export const allBoostingCoinHandler: RouteHandler<
  typeof allBoostingCoinRoute
> = async (c) => {
  try {
    const data = await db.query.boosting_coin.findMany({
      orderBy: asc(boosting_coin.coin),
    })
    return c.json({ data }, 200)
  } catch (error) {
    return c.json({ message: "Something went wrong" }, 500)
  }
}
