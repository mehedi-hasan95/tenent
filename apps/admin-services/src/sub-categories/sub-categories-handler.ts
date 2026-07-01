import { RouteHandler } from "@workspace/open-api"

import {
  and,
  db,
  desc,
  eq,
  inArray,
  isNotNull,
  isNull,
  ne,
  or,
  sql,
} from "@workspace/db"
import {
  categories,
  subCategories,
} from "@workspace/db/schema/categories.schema"
import {
  createSubCategoryRoute,
  deleteManySubCategoryRoute,
  deleteSubCategoryRoute,
  deleteTrashedSubCategoryRoute,
  getSubCategoriesRoute,
  getSubCategoryRoute,
  restoreSubCategoryRoute,
  trashSubCategoryRoute,
  updateSubCategoryRoute,
} from "./sub-categories-route"

export const createSubCategoryHandler: RouteHandler<
  typeof createSubCategoryRoute
> = async (c) => {
  const { name, slug, categorySlug } = c.req.valid("json")
  try {
    const existingSlug = await db.query.subCategories.findFirst({
      where: eq(subCategories.slug, slug),
    })
    if (existingSlug) {
      return c.json({ message: "Slug already exist" }, 400)
    }
    const data = await db
      .insert(subCategories)
      .values({ name, slug, categorySlug })
      .returning()
    return c.json({ data }, 201)
  } catch (error) {
    return c.json({ error })
  }
}

export const updateSubCategoryHandler: RouteHandler<
  typeof updateSubCategoryRoute
> = async (c) => {
  const { name, slug, categorySlug, id } = c.req.valid("json")
  try {
    const existingSlug = await db.query.subCategories.findFirst({
      where: and(eq(subCategories.slug, slug), ne(subCategories.id, id)),
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
    const [updatedSubCategory] = await db
      .update(subCategories)
      .set({
        name,
        slug,
        categorySlug,
      })
      .where(eq(subCategories.id, id))
      .returning()
    return c.json({ updatedSubCategory })
  } catch (error) {
    return c.json({ error })
  }
}

export const getSubCategoriesHandler: RouteHandler<
  typeof getSubCategoriesRoute
> = async (c) => {
  try {
    const { slug, type } = c.req.valid("query")

    const data = await db
      .select()
      .from(subCategories)
      .where(
        and(
          type === undefined
            ? undefined
            : type
              ? isNull(subCategories.deleted_at)
              : isNotNull(subCategories.deleted_at),
          slug ? eq(subCategories.categorySlug, slug) : undefined
        )
      )
      .orderBy(desc(subCategories.createdAt))
    return c.json({ data }, 200)
  } catch (error) {
    return c.json({ error, success: false })
  }
}

export const getSubCategoryHandler: RouteHandler<
  typeof getSubCategoryRoute
> = async (c) => {
  try {
    const { slug } = c.req.valid("query")
    const data = await db.query.subCategories.findFirst({
      where: eq(subCategories.slug, slug),
    })
    return c.json({ data }, 200)
  } catch (error) {
    return c.json({ error, success: false })
  }
}

export const trashSubCategoryHandler: RouteHandler<
  typeof trashSubCategoryRoute
> = async (c) => {
  try {
    const { slug } = c.req.valid("json")
    const data = await db
      .update(subCategories)
      .set({ deleted_at: sql`NOW() + INTERVAL '30 days'` })
      .where(eq(subCategories.slug, slug))
      .returning()
    return c.json({ data }, 201)
  } catch (error) {
    return c.json({ error, success: false })
  }
}

export const restoreSubCategoryHandler: RouteHandler<
  typeof restoreSubCategoryRoute
> = async (c) => {
  try {
    const { slug } = c.req.valid("json")
    const data = await db
      .update(subCategories)
      .set({ deleted_at: null })
      .where(eq(subCategories.slug, slug))
      .returning()
    return c.json({ data }, 201)
  } catch (error) {
    return c.json({ error, success: false })
  }
}

export const deleteSubCategoryHandler: RouteHandler<
  typeof deleteSubCategoryRoute
> = async (c) => {
  try {
    const { slug } = c.req.valid("json")
    const data = await db
      .delete(subCategories)
      .where(eq(subCategories.slug, slug))
    return c.json({ data, success: true }, 201)
  } catch (error) {
    return c.json({ error, success: false })
  }
}

export const deleteManySubCategoryHandler: RouteHandler<
  typeof deleteManySubCategoryRoute
> = async (c) => {
  try {
    const { slug } = c.req.valid("json")

    const data = await db
      .delete(subCategories)
      .where(
        and(
          inArray(subCategories.slug, slug),
          isNotNull(subCategories.deleted_at)
        )
      )
      .returning()
    if (!data.length) {
      return c.json({ message: "Sub Category not found or not in trash" })
    }
    return c.json({ data }, 201)
  } catch (error) {
    return c.json({ error, success: false })
  }
}

export const deleteTrashedSubCategoryHandler: RouteHandler<
  typeof deleteTrashedSubCategoryRoute
> = async (c) => {
  try {
    const data = await db
      .delete(subCategories)
      .where(isNotNull(subCategories.deleted_at))
      .returning()
    if (!data.length) {
      return c.json({ message: "Nothing in trash" })
    }
    return c.json({ data }, 201)
  } catch (error) {
    return c.json({ error, success: false })
  }
}
