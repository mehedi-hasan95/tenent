import { createRoute } from "@workspace/open-api"
import { authMiddleware, sellerMiddleware } from "../middleware"
import z from "zod"
import { DEFAULT_SIZE } from "@workspace/validators/types/constants.types"
import { productBoostingValidator } from "@workspace/validators/validators/boosting-validators"

const tags = ["Boosting"]
export const getActiveBoostingCoinRoute = createRoute({
  method: "get",
  path: "/active-boosting-coin",
  tags,
  middleware: authMiddleware,
  summary: "Get Active Boosting Coin",
  responses: {
    200: { description: "OK" },
    401: { description: "UNAUTHORIZE" },
    500: { description: "INTERNAL_SERVER_ERROR" },
  },
})

export const vendorCoinsRoute = createRoute({
  method: "get",
  path: "/vendor-coin",
  summary: "Get vendors coin for boosting",
  tags,
  middleware: sellerMiddleware,
  responses: {
    200: {
      description: "OK",
    },
    400: { description: "Bad Request" },
    401: { description: "Unauthorized" },
    500: { description: "Internal server error" },
  },
})

export const vendorCoinPurchaseHistoryRoute = createRoute({
  method: "get",
  path: "/coin-purchase-history",
  summary: "Vendor coin purchase history",
  tags,
  middleware: sellerMiddleware,
  request: {
    query: z.object({
      page: z.coerce.number().positive().default(1),
      limit: z.coerce.number().positive().default(DEFAULT_SIZE),
    }),
  },
  responses: {
    200: { description: "OK" },
    400: { description: "Bad Request" },
    401: { description: "Unauthorized" },
    500: { description: "Internal server error" },
  },
})

export const productBoostingRoute = createRoute({
  method: "post",
  path: "/product-boosting",
  summary: "Product boosting",
  tags,
  middleware: sellerMiddleware,
  request: {
    body: {
      content: {
        "application/json": {
          schema: productBoostingValidator,
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

export const getAllBoostedProductsRoute = createRoute({
  method: "get",
  path: "/all-boosted-products",
  summary: "Get vendors all boosted products",
  tags,
  middleware: sellerMiddleware,
  request: {
    query: z.object({
      page: z.coerce.number().positive().default(1),
      limit: z.coerce.number().positive().default(DEFAULT_SIZE),
    }),
  },
  responses: {
    200: { description: "OK" },
    400: { description: "Bad Request" },
    401: { description: "Unauthorized" },
    500: { description: "Internal server error" },
  },
})
