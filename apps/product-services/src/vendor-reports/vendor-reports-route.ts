import { createRoute } from "@workspace/open-api"
import { adminMiddleware, sellerMiddleware } from "../middleware"
import z from "zod"
import { DEFAULT_SIZE } from "@workspace/validators/types/constants.types"
import {
  updateOrderItemsValidator,
  startEndDateValidator,
} from "@workspace/validators/validators/order-validators"

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

export const vendorCountryBasedRoute = createRoute({
  method: "get",
  path: "/country-based",
  summary: "Vendor country based reports with sell reports",
  tags,
  middleware: sellerMiddleware,
  responses: {
    200: { description: "OK" },
    400: { description: "Bad Request" },
    401: { description: "Unauthorized" },
    500: { description: "Internal server error" },
  },
})

export const vendorPreviousYearsReportRoute = createRoute({
  method: "get",
  path: "/previous-year-reports",
  summary: "Vendor previous 1 year report",
  tags,
  middleware: sellerMiddleware,
  request: {
    query: startEndDateValidator,
  },
  responses: {
    200: { description: "OK" },
    400: { description: "Bad Request" },
    401: { description: "Unauthorized" },
    500: { description: "Internal server error" },
  },
})

export const vendorDailyReportRoute = createRoute({
  method: "get",
  path: "/daily-reports",
  summary: "Vendor daily report",
  description: "Vendor can expand reports with startDate to endDate",
  tags,
  middleware: sellerMiddleware,
  request: {
    query: startEndDateValidator,
  },
  responses: {
    200: { description: "OK" },
    400: { description: "Bad Request" },
    401: { description: "Unauthorized" },
    500: { description: "Internal server error" },
  },
})

export const vendorPopularProductsRoute = createRoute({
  method: "get",
  path: "/popular-products",
  summary: "Get a vendor popular products",
  tags,
  middleware: sellerMiddleware,
  responses: {
    200: { description: "OK" },
    400: { description: "Bad Request" },
    401: { description: "Unauthorized" },
    500: { description: "Internal server error" },
  },
})

export const vendorProductsSaleRoute = createRoute({
  method: "get",
  path: "/products-sale-reports",
  summary: "Vendor daily products report",
  description: "Vendor can expand products sale with startDate to endDate",
  tags,
  middleware: sellerMiddleware || adminMiddleware,
  request: {
    query: startEndDateValidator.extend({ productId: z.uuid().optional() }),
  },
  responses: {
    200: { description: "OK" },
    400: { description: "Bad Request" },
    401: { description: "Unauthorized" },
    500: { description: "Internal server error" },
  },
})
