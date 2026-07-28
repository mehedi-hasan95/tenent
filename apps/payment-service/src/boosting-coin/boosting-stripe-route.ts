import { createRoute } from "@workspace/open-api"
import { sellerMiddleware } from "../middleware"
import z from "zod"

const tags = ["Boosting for Vendor"]
export const buyCoinRoute = createRoute({
  method: "post",
  path: "/buy-coin",
  summary: "Buy coin for product's boosting",
  tags,
  middleware: sellerMiddleware,
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({ coin: z.coerce.number().positive().min(1) }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Webhook received successfully",
    },
    400: { description: "Bad Request" },
    401: { description: "Unauthorized" },
    500: { description: "Internal server error" },
  },
})
