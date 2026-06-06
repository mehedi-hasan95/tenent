import { createRoute } from "@workspace/open-api"
import { slugRegex } from "@workspace/validators/validators/regex"
import z from "zod"
import { adminMiddleware } from "../middleware"

const tags = ["Categories"]
export const createCategoryRoute = createRoute({
  method: "post",
  path: "/create-category",
  tags,
  summary: "Create Category",
  middleware: adminMiddleware,
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: z.object({
            name: z.string().min(2).max(64),
            slug: z
              .string()
              .min(2)
              .max(64)
              .regex(slugRegex, "Invalid slug format"),
            image: z
              .any()
              .openapi({
                type: "string",
                format: "binary",
              })
              .optional(),
          }),
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

export const updateCategoryRoute = createRoute({
  method: "patch",
  path: "/update-category",
  tags,
  summary: "Update Category",
  middleware: adminMiddleware,
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: z.object({
            id: z.string(),
            name: z.string().min(2).max(64),
            slug: z
              .string()
              .min(2)
              .max(64)
              .regex(slugRegex, "Invalid slug format"),
            image: z
              .any()
              .openapi({
                type: "string",
                format: "binary",
              })
              .optional(),
          }),
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

export const getCategoriesRoute = createRoute({
  method: "get",
  path: "/get-categories",
  tags,
  summary: "Get Categories",
  responses: {
    200: { description: "OK" },
    400: { description: "Bad Request" },
    404: { description: "Not Found" },
    500: { description: "Internal server error" },
  },
})

export const getCategoryRoute = createRoute({
  method: "get",
  path: "/get-category",
  tags,
  summary: "Get Category",
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

export const deleteCategoryRoute = createRoute({
  method: "delete",
  path: "/delete-category",
  tags,
  summary: "delete Category",
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
