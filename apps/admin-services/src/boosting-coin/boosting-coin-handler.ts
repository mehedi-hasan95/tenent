import { RouteHandler } from "@workspace/open-api"
import {
  allBoostingCoinRoute,
  createBoostingCoinRoute,
  setActiveBoostingCoinRoute,
} from "./boosting-coin-route"
import { asc, db, eq } from "@workspace/db"
import { boostingCoin } from "@workspace/db/schema/boosting.schema"

export const createBoostingCoinHandler: RouteHandler<
  typeof createBoostingCoinRoute
> = async (c) => {
  try {
    const { coin } = c.req.valid("json")
    const [data] = await db.insert(boostingCoin).values({ coin }).returning()
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

    const activeCoin = await db.query.boostingCoin.findFirst({
      where: eq(boostingCoin.id, id),
      columns: {
        isActive: true,
      },
    })

    if (!activeCoin) {
      return c.json({ message: "Plan not found" }, 404)
    }

    if (activeCoin.isActive) {
      return c.json({ message: "Plan already active" }, 201)
    }

    const currentActive = await db.query.boostingCoin.findFirst({
      where: eq(boostingCoin.isActive, true),
      columns: {
        id: true,
      },
    })

    if (currentActive) {
      await db
        .update(boostingCoin)
        .set({ isActive: false })
        .where(eq(boostingCoin.id, currentActive.id))
    }

    await db
      .update(boostingCoin)
      .set({ isActive: true })
      .where(eq(boostingCoin.id, id))

    return c.json({ message: "New plan activated" }, 200)
  } catch (error) {
    return c.json({ message: "Something went wrong" }, 500)
  }
}

export const allBoostingCoinHandler: RouteHandler<
  typeof allBoostingCoinRoute
> = async (c) => {
  try {
    const data = await db.query.boostingCoin.findMany({
      orderBy: asc(boostingCoin.coin),
    })
    return c.json({ data }, 200)
  } catch (error) {
    return c.json({ message: "Something went wrong" }, 500)
  }
}
