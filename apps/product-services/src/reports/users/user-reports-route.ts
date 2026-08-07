import { createRoute } from "@workspace/open-api"
import { authMiddleware } from "../../middleware"
import z from "zod"
import { DEFAULT_SIZE } from "@workspace/validators/types/constants.types"
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
