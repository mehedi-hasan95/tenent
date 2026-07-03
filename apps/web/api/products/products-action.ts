import { productValidator } from "@workspace/validators/validators/products-validators"
import z from "zod"
import { PRODUCT_TYPE } from "@workspace/validators/types/product.types"

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

//

const allProductsResponseSchema = z.object({
  data: z.array(productValidator),
  nextCursor: z.string().nullable(),
  hasMore: z.boolean(),
})

export type Product = z.infer<typeof productValidator>
export type AllProductsResponse = z.infer<typeof allProductsResponseSchema>

type FetchAllProductsParams = {
  seller?: string
  cursor?: string | null
  pageSize?: number
}

// export const fetchAllProducts = async ({
//   seller,
//   cursor,
//   pageSize = 10,
// }: FetchAllProductsParams): Promise<AllProductsResponse> => {
//   const params = new URLSearchParams()
//   if (seller) params.set("seller", seller)
//   if (cursor) params.set("cursor", cursor)
//   params.set("pageSize", String(pageSize))

//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/common/all-products?${params.toString()}`
//   )

//   if (!res.ok) {
//     const error = await res.json()
//     throw error
//   }

//   const data = await res.json()
//   return data
// }

export const fetchAllProducts = async ({
  seller,
  cursor,
  pageSize = 10,
}: FetchAllProductsParams) => {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/common/all-products`
  )

  Object.entries({ seller, cursor }).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value)
  })
  url.searchParams.set("pageSize", String(pageSize))

  const response = await fetch(url.toString(), {
    method: "GET",
  })

  if (!response.ok) {
    throw await response.json()
  }

  const data: {
    data: PRODUCT_TYPE[]
    nextCursor: string | null
    hasMore: boolean
  } = await response.json()
  return data
}
