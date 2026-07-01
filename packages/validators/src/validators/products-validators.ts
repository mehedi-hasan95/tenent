import z from "zod"
import { DELIVERY_ENUM, STATUS_ENUM } from "../@types/constants.types"
import { formArray, jsonArray } from "./constractor"

const MAX_TOTAL_SIZE = 16 * 1024 * 1024
const customError = "custom" as const

export const specificationSchema = z.object({
  key: z.string().min(1, "Key is required"),
  value: z.string().min(1, "Value is required"),
})
export const baseProductValidator = z.object({
  title: z.string().min(1),
  shortDescription: z.string().max(160),
  description: z.string().nonempty(),
  basePrice: z.coerce.number().nonnegative(),
  salePrice: z.coerce.number().nonnegative(),
  stock: z.coerce.number().int().nonnegative(),
  tags: formArray(z.array(z.string()).optional()),
  weight: z.coerce.number().nonnegative().optional(),
  type: z.enum(DELIVERY_ENUM).default("physical"),
  status: z.enum(STATUS_ENUM).default("draft"),

  previousImage: z.array(z.string()).optional(),
  categorySlug: z.string().nonempty(),
  subCategorySlug: z.string().nonempty(),
  color: formArray(
    z
      .array(
        z
          .string()
          .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Invalid hex color")
      )
      .optional()
  ),
  specification: jsonArray(z.array(specificationSchema).default([])),

  cashOnDelivery: z.coerce.boolean().default(false),
  coupon: z.string().max(20).optional(),
  sizes: formArray(z.array(z.string()).optional()),
})

export const productValidator = baseProductValidator
  .extend({
    images: z
      .array(
        z.instanceof(File).refine((file) => file.type.startsWith("image/"), {
          message: "Only image files are allowed",
        })
      )
      // .min(1, "At least one image is required")
      .max(5, "You can't add more then 5 images")
      .optional()
      .refine(
        (files) =>
          files &&
          files.reduce((total, file) => total + file.size, 0) <= MAX_TOTAL_SIZE,
        {
          message: "Total image size must be less than 16MB",
        }
      ),
  })
  .superRefine((data, ctx) => {
    const newImagesCount = data.images?.length ?? 0
    const previousImagesCount = data?.previousImage?.length ?? 0
    const totalCount = newImagesCount + previousImagesCount

    // ✅ Require at least one image
    if (totalCount === 0) {
      ctx.addIssue({
        path: ["images"],
        code: customError,
        message: "Please add at least one image",
      })
      return // stop further validation
    }

    // ✅ Max 5 images rule
    if (totalCount > 5) {
      if (previousImagesCount > 0) {
        ctx.addIssue({
          path: ["images"],
          code: customError,
          message: "Remove previous images first to add more images",
        })
      } else {
        ctx.addIssue({
          path: ["images"],
          code: customError,
          message: "You can upload at most 5 images",
        })
      }
    }
  })

export const productOpenApiValidator = baseProductValidator
  .extend({
    images: z
      .preprocess(
        (val) => (Array.isArray(val) ? val : [val]),
        z.array(z.any().optional()).max(5, "You can't add more then 5 images")
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    const newImagesCount = data.images?.length ?? 0
    const previousImagesCount = data?.previousImage?.length ?? 0
    const totalCount = newImagesCount + previousImagesCount

    // ✅ Require at least one image
    if (totalCount === 0) {
      ctx.addIssue({
        path: ["images"],
        code: customError,
        message: "Please add at least one image",
      })
      return // stop further validation
    }

    // ✅ Max 5 images rule
    if (totalCount > 5) {
      if (previousImagesCount > 0) {
        ctx.addIssue({
          path: ["images"],
          code: customError,
          message: "Remove previous images first to add more images",
        })
      } else {
        ctx.addIssue({
          path: ["images"],
          code: customError,
          message: "You can upload at most 5 images",
        })
      }
    }
  })
