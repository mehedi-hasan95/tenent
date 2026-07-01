import { createRoute } from "@workspace/open-api"
import { sellerMiddleware } from "../middleware"
import { productOpenApiValidator } from "@workspace/validators/validators/products-validators"

const tags = ["Products"]
export const createProductRoute = createRoute({
  method: "post",
  path: "/create-product",
  tags,
  summary: "Create a product",
  middleware: sellerMiddleware,
  request: {
    body: {
      content: { "multipart/form-data": { schema: productOpenApiValidator } },
    },
  },
  responses: {
    201: { description: "OK" },
    400: { description: "BAD_REQUEST" },
    401: { description: "UNAUTHORIZED" },
    500: { description: "INTERNAL_SERVER_ERROR" },
  },
})
