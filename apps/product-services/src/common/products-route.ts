import { createRoute } from "@workspace/open-api"
import { DEFAULT_SIZE } from "@workspace/validators/types/constants.types"
import z from "zod"

const tags = ["Products Common API"]
export const allProductsRoute = createRoute({
  method: "get",
  path: "/all-products",
  tags,
  summary: "Get all Products",
  request: {
    query: z.object({
      seller: z.string().optional(),
      cursor: z.string().optional(),
      pageSize: z.coerce.number().int().min(1).max(50).default(DEFAULT_SIZE),
    }),
  },
  responses: {
    200: {
      description: "OK",
    },
    400: { description: "BAD_REQUEST" },
    500: { description: "INTERNAL_SERVER_ERROR" },
  },
})
