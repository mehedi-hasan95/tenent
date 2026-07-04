import { RouteHandler } from "@workspace/open-api"
import {
  allTrashedProductsRoute,
  createProductRoute,
  deleteManyProductsRoute,
  deleteTrashedProductsRoute,
  restoreProductsRoute,
  trashedProductRoute,
  updateProductRoute,
} from "./products-route"
import { utapi } from "@workspace/uploadthing"
import { and, db, eq, inArray, isNotNull, sql } from "@workspace/db"
import { products } from "@workspace/db/schema/products.schema"

export const createProductHandler: RouteHandler<
  typeof createProductRoute
> = async (c) => {
  const user = c.get("user")
  if (!user?.stripeVerified) {
    return c.json({ message: "Please setup Stripe Connect" }, 400)
  }
  const formData = c.req.valid("form")
  if (!formData.images) {
    return c.json({ message: "Please add Image" }, 400)
  }
  try {
    const uploadedImages = await utapi.uploadFiles(formData?.images)
    const imageLinks = uploadedImages.map(
      (item) => item.data?.ufsUrl
    ) as string[]
    const [data] = await db
      .insert(products)
      .values({ ...formData, userEmail: user.email, images: imageLinks })
      .returning()
    return c.json({ data }, 201)
  } catch (error) {
    return c.json({ error })
  }
}

export const updateProductHandler: RouteHandler<
  typeof updateProductRoute
> = async (c) => {
  const user = c.get("user")
  if (!user?.stripeVerified) {
    return c.json({ message: "Please setup Stripe Connect" }, 400)
  }
  const formData = c.req.valid("form")

  try {
    let allImages = formData.previousImage ?? []

    if (formData.images?.length) {
      const uploadedImages = await utapi.uploadFiles(formData.images)

      const newImages = uploadedImages
        .map((item) => item.data?.ufsUrl)
        .filter(Boolean) as string[]

      allImages = [...allImages, ...newImages]
    }

    const [data] = await db
      .update(products)
      .set({ ...formData, images: allImages })
      .where(eq(products.id, formData.id))
      .returning()
    return c.json({ data }, 201)
  } catch (error) {
    return c.json({ error })
  }
}

export const trashedProductHandler: RouteHandler<
  typeof trashedProductRoute
> = async (c) => {
  try {
    const { id } = c.req.valid("json")
    const user = c.get("user")
    if (!id) {
      return c.json({ message: "Missing the ID" }, 400)
    }

    const data = await db
      .update(products)
      .set({ deleted_at: sql`NOW() + INTERVAL '30 days'` })
      .where(and(eq(products.id, id), eq(products.userEmail, user?.email!)))
      .returning()

    if (!data.length) {
      return c.json({ message: "This product is not yours" }, 404)
    }
    return c.json({ message: "Product in trash successfully" }, 200)
  } catch (error) {
    return c.json({ error })
  }
}

export const allTrashedProductsHandler: RouteHandler<
  typeof allTrashedProductsRoute
> = async (c) => {
  try {
    const email = c.get("user")?.email
    const data = await db.query.products.findMany({
      where: and(
        eq(products.userEmail, email!),
        isNotNull(products.deleted_at)
      ),
    })
    return c.json({ data }, 200)
  } catch (error) {
    return c.json({ message: "Something went wrong" }, 500)
  }
}

export const restoreProductsHandler: RouteHandler<
  typeof restoreProductsRoute
> = async (c) => {
  try {
    const { id } = c.req.valid("json")
    const email = c.get("user")?.email
    const data = await db
      .update(products)
      .set({ deleted_at: null })
      .where(and(eq(products.id, id), eq(products.userEmail, email!)))
      .returning()
    return c.json({ data }, 201)
  } catch (error) {
    return c.json({ error, success: false })
  }
}

export const deleteManyProductsHandler: RouteHandler<
  typeof deleteManyProductsRoute
> = async (c) => {
  try {
    const { id } = c.req.valid("json")
    const email = c.get("user")?.email
    const data = await db
      .delete(products)
      .where(
        and(
          inArray(products.id, id),
          isNotNull(products.deleted_at),
          eq(products.userEmail, email!)
        )
      )
      .returning()
    if (!data.length) {
      return c.json({ message: "Products not found or not in trash" })
    }
    return c.json({ data }, 201)
  } catch (error) {
    return c.json({ error, success: false })
  }
}

export const deleteTrashedProductsHandler: RouteHandler<
  typeof deleteTrashedProductsRoute
> = async (c) => {
  try {
    const email = c.get("user")?.email
    const data = await db
      .delete(products)
      .where(
        and(isNotNull(products.deleted_at), eq(products.userEmail, email!))
      )
      .returning()
    if (!data.length) {
      return c.json({ message: "Nothing in trash" })
    }
    return c.json({ data }, 201)
  } catch (error) {
    return c.json({ error, success: false })
  }
}
