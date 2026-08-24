import { createRoute } from "@workspace/open-api"
import { productListQuerySchema } from "@workspace/validators/validators/products-validators"
import z from "zod"

const tags = ["Public Products API"]
export const allProductsRoute = createRoute({
  method: "get",
  path: "/all-products",
  tags,
  summary: "Get all Products",
  request: {
    query: productListQuerySchema.extend({ cats: z.string().optional() }),
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

export const popularProductsRoute = createRoute({
  method: "get",
  path: "/popular-products",
  summary: "Get popular products",
  description: "Get popular products based on most sale",
  tags,
  responses: {
    200: { description: "OK" },
    400: { description: "Bad Request" },
    401: { description: "Unauthorized" },
    500: { description: "Internal server error" },
  },
})

export const ratingAndReviewRoute = createRoute({
  method: "get",
  path: "/retrieve-rating/{id}",
  summary: "Rating and reviews",
  tags,
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
