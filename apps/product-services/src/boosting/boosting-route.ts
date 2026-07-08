import { createRoute } from "@workspace/open-api"
import { authMiddleware } from "../middleware"

const tags = ["Boosting"]
export const getActiveBoostingCoinRoute = createRoute({
  method: "get",
  path: "/active-boosting-coin",
  tags,
  middleware: authMiddleware,
  summary: "Get Active Boosting Coin",
  responses: {
    200: { description: "OK" },
    403: { description: "UNAUTHORIZE" },
    500: { description: "INTERNAL_SERVER_ERROR" },
  },
})
