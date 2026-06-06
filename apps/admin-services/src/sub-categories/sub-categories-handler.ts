import { RouteHandler } from "@workspace/open-api"

import { and, db, eq, ne } from "@workspace/db"
import { subCategories } from "@workspace/db/schema/categories.schema"
import {
  createSubCategoryRoute,
  deleteSubCategoryRoute,
  getSubCategoriesRoute,
  getSubCategoryRoute,
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
      return c.json({ message: "Slug already exist", success: false }, 400)
    }

    const data = await db
      .update(subCategories)
      .set({ name, slug, categorySlug })
      .returning()
    return c.json({ data }, 201)
  } catch (error) {
    return c.json({ error })
  }
}

export const getSubCategoriesHandler: RouteHandler<
  typeof getSubCategoriesRoute
> = async (c) => {
  try {
    const data = await db.query.subCategories.findMany()
    return c.json({ data, success: true }, 200)
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
