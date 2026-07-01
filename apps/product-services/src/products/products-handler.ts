import { RouteHandler } from "@workspace/open-api"
import { createProductRoute } from "./products-route"
import { utapi } from "@workspace/uploadthing"
import { db } from "@workspace/db"
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
