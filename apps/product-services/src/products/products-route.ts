import { createRoute } from "@workspace/open-api"
import {
  DEFAULT_SIZE,
  PRODUCTS_STATUS_ENUM,
} from "@workspace/validators/types/constants.types"
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

export const singleProductsRoute = createRoute({
  method: "get",
  path: "/single-products",
  tags,
  summary: "Get single Products",
  request: {
    query: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      description: "OK",
    },
    404: { description: "BAD_REQUEST" },
    500: { description: "INTERNAL_SERVER_ERROR" },
  },
})

export const boostedProductRoute = createRoute({
  method: "get",
  path: "/boosted-products",
  summary: "Get boosted products",
  tags,

  responses: {
    200: { description: "OK" },
    500: { description: "Internal server error" },
  },
})
