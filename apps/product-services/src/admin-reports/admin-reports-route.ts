import { createRoute } from "@workspace/open-api"
import { adminMiddleware } from "../middleware"
import z from "zod"
import { DEFAULT_SIZE } from "@workspace/validators/types/constants.types"
import { yearlyReportsValidator } from "@workspace/validators/validators/order-validators"

const tags = ["Admin Reports"]
export const adminTotalRevenueRoute = createRoute({
  method: "get",
  path: "/total-revenue",
  summary: "Admin revenue reports",
  description:
    "Get Admin total revenue, order, orderItems and distinctUser with previous month increase or decrease",
  tags,
  middleware: adminMiddleware,
  responses: {
    200: { description: "OK" },
    400: { description: "Bad Request" },
    401: { description: "Unauthorized" },
    500: { description: "Internal server error" },
  },
})

export const adminAllOrdersRoute = createRoute({
  method: "get",
  path: "/all-orders",
  summary: "Admin all orders",
  tags,
  middleware: adminMiddleware,
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

export const adminSingleOrderRoute = createRoute({
  method: "get",
  path: `/single-order/{id}`,
  summary: "Get Admin single order",
  tags,
  middleware: adminMiddleware,
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

export const adminCountryBasedRoute = createRoute({
  method: "get",
  path: "/country-based",
  summary: "Admin country based reports with sell reports",
  tags,
  middleware: adminMiddleware,
  responses: {
    200: { description: "OK" },
    400: { description: "Bad Request" },
    401: { description: "Unauthorized" },
    500: { description: "Internal server error" },
  },
})

export const adminPreviousYearsReportRoute = createRoute({
  method: "get",
  path: "/previous-year-reports",
  summary: "Admin previous 1 year report",
  tags,
  middleware: adminMiddleware,
  request: {
    query: yearlyReportsValidator,
  },
  responses: {
    200: { description: "OK" },
    400: { description: "Bad Request" },
    401: { description: "Unauthorized" },
    500: { description: "Internal server error" },
  },
})

export const adminDailyReportRoute = createRoute({
  method: "get",
  path: "/daily-reports",
  summary: "Admin daily report",
  description: "Admin can expand reports with startDate to endDate",
  tags,
  middleware: adminMiddleware,
  request: {
    query: yearlyReportsValidator,
  },
  responses: {
    200: { description: "OK" },
    400: { description: "Bad Request" },
    401: { description: "Unauthorized" },
    500: { description: "Internal server error" },
  },
})

export const adminPopularProductsRoute = createRoute({
  method: "get",
  path: "/popular-products",
  summary: "Get a Admin popular products",
  tags,
  middleware: adminMiddleware,
  responses: {
    200: { description: "OK" },
    400: { description: "Bad Request" },
    401: { description: "Unauthorized" },
    500: { description: "Internal server error" },
  },
})

export const adminAllUsersRoute = createRoute({
  method: "get",
  path: "/all-users",
  summary: "Get all users",
  tags,
  middleware: adminMiddleware,
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

export const adminCountRoute = createRoute({
  method: "get",
  path: "/count-constants",
  summary: "Count Cat, Sub Cat, and Products",
  tags,
  middleware: adminMiddleware,
  responses: {
    200: { description: "OK" },
    400: { description: "Bad Request" },
    401: { description: "Unauthorized" },
    500: { description: "Internal server error" },
  },
})
