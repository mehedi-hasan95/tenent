import { productValidator } from "@workspace/validators/validators/products-validators"
import z from "zod"

export const createProductAction = async (
  data: z.input<typeof productValidator>
) => {
  const fd = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return

    if (key === "images") {
      ;(value as File[]).forEach((file) => fd.append("images", file))
    } else if (key === "specification") {
      fd.append(key, JSON.stringify(value))
    } else if (Array.isArray(value)) {
      value.forEach((v) => fd.append(key, String(v)))
    } else {
      fd.append(key, String(value))
    }
  })
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/products/create-product`,
    {
      method: "POST",

      body: fd,
      credentials: "include",
    }
  )
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  return response.json()
}
