import { createRoute } from "@workspace/open-api"
import { authMiddleware } from "../middleware"
import z from "zod"

const tags = ["Orders"]
export const createOrderRoute = createRoute({
  method: "post",
  path: "/create-order",
  summary: "Create an order",
  tags,
  middleware: authMiddleware,
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            ids: z.array(z.string()),
          }),
        },
      },
    },
  },
  responses: {
    200: { description: "OK" },
    400: { description: "Bad Request" },
    401: { description: "Unauthorized" },
    500: { description: "Internal server error" },
  },
})
