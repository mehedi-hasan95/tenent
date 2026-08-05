import { createRoute } from "@workspace/open-api"
import { authMiddleware } from "../middleware"
import z from "zod"
import { createStripeOrderValidator } from "@workspace/validators/validators/order-validators"

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
          schema: createStripeOrderValidator,
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

export const retrieveOrderRoute = createRoute({
  method: "get",
  path: "/retrieve-current-order/:id",
  summary: "Retrieve current payment from stripe",
  tags,
  middleware: authMiddleware,
  request: {
    query: z.object({ id: z.string() }),
  },
  responses: {
    200: { description: "OK" },
    400: { description: "Bad Request" },
    401: { description: "Unauthorized" },
    500: { description: "Internal server error" },
  },
})
