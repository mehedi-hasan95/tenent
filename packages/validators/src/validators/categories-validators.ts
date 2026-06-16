import z from "zod"
import { slugRegex } from "./regex"

export const categoriesValidators = z
  .object({
    name: z.string().min(2).max(64),
    slug: z.string().min(2).max(64).regex(slugRegex, "Invalid slug format"),
    image: z
      .instanceof(File)
      .refine((file) => file.type.startsWith("image/"), {
        message: "Only image files are allowed",
      })
      .refine((file) => file.size <= 2 * 1024 * 1024, {
        message: "Image size must be less than 2MB",
      })
      .optional(),
    previousImage: z.string().optional(),
  })
  .refine((data) => !(data.image && data.previousImage), {
    message: "Remove the previous image before uploading a new one",
    path: ["previousImage"],
  })

export const subCategoriesValidators = z.object({
  name: z.string().nonempty(),
  slug: z.string().nonempty().regex(slugRegex, "Invalid slug format"),
  categorySlug: z.string().nonempty(),
})
