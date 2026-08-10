import { createRoute } from "@workspace/open-api"
import { authMiddleware } from "../../middleware"
import z from "zod"
import { DEFAULT_SIZE } from "@workspace/validators/types/constants.types"
import { ratingsValidator } from "@workspace/validators/validators/order-validators"
const tags = ["User Reports"]
export const userAllOrdersRoute = createRoute({
  method: "get",
  path: "/user-all-orders",
  summary: "User all orders",
  tags,
  middleware: authMiddleware,
  request: {
    query: z.object({
      limit: z.coerce
        .number()
        .min(1)
        .max(50)
        .positive()
        .int()
        .default(DEFAULT_SIZE),
      page: z.coerce.number().positive().int().default(1),
    }),
  },
  responses: {
    200: { description: "OK" },
    400: { description: "Bad Request" },
    401: { description: "Unauthorized" },
    500: { description: "Internal server error" },
  },
})

export const getSingleOrderRoute = createRoute({
  method: "get",
  path: "/orders/{id}",
  summary: "Get user single order item",
  tags,
  middleware: authMiddleware,
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: { description: "OK" },
    400: { description: "Bad Request" },
    401: { description: "Unauthorized" },
    500: { description: "Internal server error" },
  },
})

export const addRatingRoute = createRoute({
  method: "post",
  path: "/add-rating",
  summary: "Add rating and review for a purchase product",
  tags,
  middleware: authMiddleware,
  request: {
    body: {
      content: {
        "application/json": {
          schema: ratingsValidator,
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

export const getAllRatingsRoute = createRoute({
  method: "get",
  path: "/all-ratings",
  summary: "A users all ratings and reviews",
  tags,
  middleware: authMiddleware,

  responses: {
    200: { description: "OK" },
    400: { description: "Bad Request" },
    401: { description: "Unauthorized" },
    500: { description: "Internal server error" },
  },
})
