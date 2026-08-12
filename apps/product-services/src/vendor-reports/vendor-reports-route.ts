import { createRoute } from "@workspace/open-api"
import { sellerMiddleware } from "../middleware"
import z from "zod"
import { DEFAULT_SIZE } from "@workspace/validators/types/constants.types"
import { orderStatusEnum } from "@workspace/validators/types/enum.types"
import { updateOrderItemsValidator } from "@workspace/validators/validators/order-validators"

const tags = ["Vendor Reports"]
export const vendorTotalRevenueRoute = createRoute({
  method: "get",
  path: "/total-revenue",
  summary: "Vendor revenue reports",
  description:
    "Get Vendor total revenue, order, orderItems and distinctUser with previous month increase or decrease",
  tags,
  middleware: sellerMiddleware,
  responses: {
    200: { description: "OK" },
    400: { description: "Bad Request" },
    401: { description: "Unauthorized" },
    500: { description: "Internal server error" },
  },
})

export const vendorAllOrdersRoute = createRoute({
  method: "get",
  path: "/all-orders",
  summary: "Vendor all orders",
  tags,
  middleware: sellerMiddleware,
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

export const vendorSingleOrderRoute = createRoute({
  method: "get",
  path: `/single-order/{id}`,
  summary: "Get Vendor single order",
  tags,
  middleware: sellerMiddleware,
  request: {
    params: z.object({ id: z.uuid() }),
  },
  responses: {
    200: { description: "OK" },
    400: { description: "Bad Request" },
    401: { description: "Unauthorized" },
    500: { description: "Internal server error" },
  },
})

export const updateVendorSingleOrderRoute = createRoute({
  method: "patch",
  path: "/update-order",
  summary: "Update Vendor single order",
  tags,
  middleware: sellerMiddleware,
  request: {
    body: {
      content: {
        "application/json": {
          schema: updateOrderItemsValidator,
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
