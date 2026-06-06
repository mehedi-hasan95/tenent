import { createRoute } from "@workspace/open-api"
import { slugRegex } from "@workspace/validators/validators/regex"
import z from "zod"
import { adminMiddleware } from "../middleware"
import { subCategoriesValidators } from "@workspace/validators/validators/categories-validators"

const tags = ["Sub Categories"]
export const createSubCategoryRoute = createRoute({
  method: "post",
  path: "/create-sub-category",
  tags,
  summary: "Create Sub Category",
  middleware: adminMiddleware,
  request: {
    body: {
      content: {
        "application/json": {
          schema: subCategoriesValidators,
        },
      },
    },
  },
  responses: {
    201: { description: "Created" },
    400: { description: "Bad Request" },
    500: { description: "Internal server error" },
  },
})

export const updateSubCategoryRoute = createRoute({
  method: "patch",
  path: "/update-sub-category",
  tags,
  summary: "Update Sub Category",
  middleware: adminMiddleware,
  request: {
    body: {
      content: {
        "application/json": {
          schema: subCategoriesValidators.extend({ id: z.string() }),
        },
      },
    },
  },
  responses: {
    201: { description: "Created" },
    400: { description: "Bad Request" },
    500: { description: "Internal server error" },
  },
})

export const getSubCategoriesRoute = createRoute({
  method: "get",
  path: "/get-sub-categories",
  tags,
  summary: "Get Sub Categories",
  responses: {
    200: { description: "OK" },
    400: { description: "Bad Request" },
    404: { description: "Not Found" },
    500: { description: "Internal server error" },
  },
})

export const getSubCategoryRoute = createRoute({
  method: "get",
  path: "/get-sub-category",
  tags,
  summary: "Get Sub Category",
  request: {
    query: z.object({ slug: z.string() }),
  },
  responses: {
    200: { description: "OK" },
    400: { description: "Bad Request" },
    404: { description: "Not Found" },
    500: { description: "Internal server error" },
  },
})

export const deleteSubCategoryRoute = createRoute({
  method: "delete",
  path: "/delete-sub-category",
  tags,
  summary: "delete Sub Category",
  middleware: adminMiddleware,
  request: {
    body: {
      content: {
        "application/json": { schema: z.object({ slug: z.string() }) },
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
