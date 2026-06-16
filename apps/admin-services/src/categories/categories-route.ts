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
            previousImage: z.string().optional(),
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
  request: {
    query: z.object({
      type: z
        .string()
        .optional()
        .transform((v) => {
          if (v === "true") return true
          if (v === "false") return false
          return undefined
        }),
    }),
  },
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

export const trashCategoryRoute = createRoute({
  method: "patch",
  path: "trash-category",
  tags,
  summary: "Trashing category",
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

export const restoreCategoryRoute = createRoute({
  method: "patch",
  path: "restore-category",
  tags,
  summary: "Restore category",
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

export const deleteManyCategoryRoute = createRoute({
  method: "delete",
  path: "/delete-many-category",
  tags,
  summary: "Delete many category",
  middleware: adminMiddleware,
  request: {
    body: {
      content: {
        "application/json": { schema: z.object({ slug: z.array(z.string()) }) },
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

export const deleteTrashedCategoryRoute = createRoute({
  method: "delete",
  path: "/delete-trashed-category",
  tags,
  summary: "Delete trashed category",
  middleware: adminMiddleware,
  responses: {
    201: { description: "OK" },
    400: { description: "Bad Request" },
    404: { description: "Not Found" },
    500: { description: "Internal server error" },
  },
})
