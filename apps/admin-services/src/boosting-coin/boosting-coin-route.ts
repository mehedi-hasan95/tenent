import { createRoute } from "@workspace/open-api"
import { adminMiddleware } from "../middleware"
import z from "zod"
import { boostingCoin } from "@workspace/validators/validators/boosting-validators"

const tags = ["Boosting Coin"]
export const createBoostingCoinRoute = createRoute({
  method: "post",
  path: "/create-boosting-coin",
  tags,
  summary: "Create Boosting Coin",
  middleware: adminMiddleware,
  request: {
    body: {
      content: {
        "application/json": {
          schema: boostingCoin,
        },
      },
    },
  },
  responses: {
    201: { description: "Created" },
    400: { description: "Bad Request" },
    500: { description: "Internal server error" },
  },
})

export const setActiveBoostingCoinRoute = createRoute({
  method: "patch",
  path: "/set-active-boosting-coin",
  tags,
  summary: "Set Active Boosting Coin",
  middleware: adminMiddleware,
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({ id: z.string() }),
        },
      },
    },
  },
  responses: {
    201: { description: "Created" },
    400: { description: "Bad Request" },
    500: { description: "Internal server error" },
  },
})

export const allBoostingCoinRoute = createRoute({
  method: "get",
  path: "/all-boosting-coin",
  tags,
  summary: "All Boosting Coin",
  middleware: adminMiddleware,
  responses: {
    200: { description: "Created" },
    400: { description: "Bad Request" },
    500: { description: "Internal server error" },
  },
})
