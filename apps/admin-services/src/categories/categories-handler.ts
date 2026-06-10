import { RouteHandler } from "@workspace/open-api"
import {
  createCategoryRoute,
  deleteCategoryRoute,
  getCategoriesRoute,
  getCategoryRoute,
  updateCategoryRoute,
} from "./categories-route"
import { and, db, eq, ne } from "@workspace/db"
import { categories } from "@workspace/db/schema/categories.schema"
import { utapi } from "@workspace/uploadthing"

export const createCategoryHandler: RouteHandler<
  typeof createCategoryRoute
> = async (c) => {
  const { name, slug, image } = c.req.valid("form")
  try {
    let imageUrl: string | undefined
    if (image) {
      const result = await utapi.uploadFiles(image)
      imageUrl = result.data?.ufsUrl
    }
    const data = await db
      .insert(categories)
      .values({ name, slug, image })
      .returning()
    return c.json({ data }, 201)
  } catch (error) {
    return c.json({ error })
  }
}

export const updateCategoryHandler: RouteHandler<
  typeof updateCategoryRoute
> = async (c) => {
  const { name, slug, image, id, previousImage } = c.req.valid("form")
  try {
    const existingSlug = await db.query.categories.findFirst({
      where: and(eq(categories.slug, slug), ne(categories.id, id)),
    })
    if (existingSlug) {
      return c.json({ message: "Slug already exist", success: false }, 400)
    }
    let imageUrl: string | undefined | null = previousImage
    if (image) {
      const uploadedImages = await utapi.uploadFiles(image)
      imageUrl = uploadedImages.data?.ufsUrl
    } else if (!previousImage) {
      imageUrl = null
    }
    const data = await db
      .update(categories)
      .set({ image: imageUrl, name, slug })
      .returning()
    return c.json({ data }, 201)
  } catch (error) {
    return c.json({ error })
  }
}

export const getCategoriesHandler: RouteHandler<
  typeof getCategoriesRoute
> = async (c) => {
  try {
    const data = await db.query.categories.findMany()
    return c.json({ data }, 200)
  } catch (error) {
    return c.json({ error, success: false })
  }
}

export const getCategoryHandler: RouteHandler<typeof getCategoryRoute> = async (
  c
) => {
  try {
    const { slug } = c.req.valid("query")
    const data = await db.query.categories.findFirst({
      where: eq(categories.slug, slug),
    })
    return c.json({ data }, 200)
  } catch (error) {
    return c.json({ error, success: false })
  }
}

export const deleteCategoryHandler: RouteHandler<
  typeof deleteCategoryRoute
> = async (c) => {
  try {
    const { slug } = c.req.valid("json")
    const data = await db.delete(categories).where(eq(categories.slug, slug))
    return c.json({ data, success: true }, 201)
  } catch (error) {
    return c.json({ error, success: false })
  }
}
