import { RouteHandler } from "@workspace/open-api"
import { getAllUserRoute } from "./users-route"
import { db } from "@workspace/db"

export const getAllUserHandler: RouteHandler<typeof getAllUserRoute> = async (
  c
) => {
  try {
    const data = await db.query.user.findMany()
    return c.json({ data }, 200)
  } catch (error) {
    return c.json({ error })
  }
}
