import { createRoute } from "@workspace/open-api"
import { sellerMiddleware } from "../middleware"
import { productOpenApiValidator } from "@workspace/validators/validators/products-validators"
import z from "zod"

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

export const updateProductRoute = createRoute({
  method: "patch",
  path: "/update-product",
  tags,
  summary: "Update a product",
  middleware: sellerMiddleware,
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: productOpenApiValidator.extend({ id: z.string() }),
        },
      },
    },
  },
  responses: {
    201: { description: "OK" },
    400: { description: "BAD_REQUEST" },
    401: { description: "UNAUTHORIZED" },
    500: { description: "INTERNAL_SERVER_ERROR" },
  },
})

export const trashedProductRoute = createRoute({
  method: "patch",
  path: "/trash-product",
  tags,
  summary: "Trashed a Product",
  middleware: sellerMiddleware,
  request: {
    body: {
      content: { "application/json": { schema: z.object({ id: z.string() }) } },
    },
  },
  responses: {
    201: { description: "OK" },
    400: { description: "BAD_REQUEST" },
    401: { description: "UNAUTHORIZED" },
    404: { description: "NOT_FOUND" },
    500: { description: "INTERNAL_SERVER_ERROR" },
  },
})

export const allTrashedProductsRoute = createRoute({
  method: "get",
  path: "/all-trashed-products",
  tags,
  summary: "All trashed products",
  middleware: sellerMiddleware,
  responses: {
    200: { description: "OK" },
    401: { description: "UNAUTHORIZED" },
    500: { description: "INTERNAL_SERVER_ERROR" },
  },
})

export const restoreProductsRoute = createRoute({
  method: "patch",
  path: "restore-products",
  tags,
  summary: "Restore Products",
  middleware: sellerMiddleware,
  request: {
    body: {
      content: {
        "application/json": { schema: z.object({ id: z.string() }) },
      },
    },
  },
  responses: {
    201: { description: "OK" },
    400: { description: "Bad Request" },
    404: { description: "Not Found" },
    500: { description: "Internal server error" },
  },
})

export const deleteManyProductsRoute = createRoute({
  method: "delete",
  path: "/delete-many-products",
  tags,
  summary: "Delete many Products",
  middleware: sellerMiddleware,
  request: {
    body: {
      content: {
        "application/json": { schema: z.object({ id: z.array(z.string()) }) },
      },
    },
  },
  responses: {
    201: { description: "OK" },
    400: { description: "Bad Request" },
    404: { description: "Not Found" },
    500: { description: "Internal server error" },
  },
})

export const deleteTrashedProductsRoute = createRoute({
  method: "delete",
  path: "/delete-trashed-products",
  tags,
  summary: "Delete trashed Products",
  middleware: sellerMiddleware,
  responses: {
    201: { description: "OK" },
    400: { description: "Bad Request" },
    404: { description: "Not Found" },
    500: { description: "Internal server error" },
  },
})

export const deleteATrashedProductRoute = createRoute({
  method: "delete",
  path: "/delete-single-product",
  tags,
  summary: "Delete a trashed Product",
  middleware: sellerMiddleware,
  request: {
    body: {
      content: { "application/json": { schema: z.object({ id: z.string() }) } },
    },
  },
  responses: {
    201: { description: "OK" },
    400: { description: "Bad Request" },
    404: { description: "Not Found" },
    500: { description: "Internal server error" },
  },
})

export const sellerAllProductRoute = createRoute({
  method: "get",
  path: "/seller-all-product",
  tags,
  summary: "Seller all Product",
  middleware: sellerMiddleware,

  responses: {
    200: { description: "OK" },
    401: { description: "Unauthorize" },
    500: { description: "Internal server error" },
  },
})
