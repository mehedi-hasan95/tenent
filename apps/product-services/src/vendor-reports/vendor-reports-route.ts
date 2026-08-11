import { createRoute } from "@workspace/open-api"
import { sellerMiddleware } from "../middleware"

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
