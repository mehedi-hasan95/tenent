import { RouteHandler } from "@workspace/open-api"
import {
  createCategoryRoute,
  deleteCategoryRoute,
  getCategoriesRoute,
  getCategoryRoute,
  updateCategoryRoute,
} from "./categories-route"
import { and, db, desc, eq, ne } from "@workspace/db"
import { categories } from "@workspace/db/schema/categories.schema"
import { utapi } from "@workspace/uploadthing"

export const createCategoryHandler: RouteHandler<
  typeof createCategoryRoute
> = async (c) => {
  const { name, slug, image } = c.req.valid("form")
  try {
    const existingSlug = await db.query.categories.findFirst({
      where: eq(categories.slug, slug),
    })
    if (existingSlug) {
      return c.json(
        {
          success: false,
          message: "Slug already exists",
        },
        400
      )
    }
    let imageUrl: string | undefined
    if (image) {
      const result = await utapi.uploadFiles(image)
      imageUrl = result.data?.ufsUrl
    }
    const [data] = await db
      .insert(categories)
      .values({ name, slug, image: imageUrl })
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
      return c.json(
        {
          success: false,
          message: "Slug already exists",
        },
        400
      )
    }

    let imageUrl: string | null = previousImage ?? null

    if (image) {
      const uploadedImage = await utapi.uploadFiles(image)
      imageUrl = uploadedImage.data?.ufsUrl ?? null
    } else if (!previousImage) {
      imageUrl = null
    }

    const [updatedCategory] = await db
      .update(categories)
      .set({
        name,
        slug,
        image: imageUrl,
      })
      .where(eq(categories.id, id))
      .returning()

    if (!updatedCategory) {
      return c.json(
        {
          success: false,
          message: "Category not found",
        },
        404
      )
    }

    return c.json(
      {
        success: true,
        data: updatedCategory,
      },
      200
    )
  } catch (error) {
    console.error(error)

    return c.json(
      {
        success: false,
        message: "Failed to update category",
      },
      500
    )
  }
}

export const getCategoriesHandler: RouteHandler<
  typeof getCategoriesRoute
> = async (c) => {
  try {
    const data = await db.query.categories.findMany({
      orderBy: (categories, { desc }) => [desc(categories.updatedAt)],
    })
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
