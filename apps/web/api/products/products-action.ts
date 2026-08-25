import { BOOSTED_PRODUCT_TYPE } from "@workspace/validators/types/boosting.types"
import { PRODUCT_TYPE } from "@workspace/validators/types/product.types"
import { productListQuerySchema } from "@workspace/validators/validators/products-validators"
import z from "zod"

export const boostedProductsAction = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/public/boosted-products`,
    {
      method: "GET",
    }
  )
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  const data: {
    data: {
      avgRating: number
      ratingCount: number
      productBoost: BOOSTED_PRODUCT_TYPE
      products: PRODUCT_TYPE
    }[]
  } = await response.json()
  return data.data
}

export const singleProductsAction = async (id: string) => {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/public/single-products`
  )

  if (id) {
    url.searchParams.set("id", id)
  }

  const response = await fetch(url.toString(), {
    method: "GET",
  })

  if (!response.ok) {
    throw await response.json()
  }

  const data: {
    data:
      | {
          avgRating: number
          ratingCount: number
          products: PRODUCT_TYPE
        }
      | undefined
  } = await response.json()
  return data.data
}

// *example: query
export const fetchAllProductsAction = async (
  data: z.infer<typeof productListQuerySchema> & { cats?: string[] }
) => {
  const params = new URLSearchParams()

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.set(key, Array.isArray(value) ? value.join(",") : String(value))
    }
  })

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/public/all-products?${params.toString()}`,
    {
      method: "GET",
    }
  )

  if (!response.ok) {
    throw await response.json()
  }

  return response.json()
}

export const popularProductsAction = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/public/popular-products`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  const data: {
    data: { products: PRODUCT_TYPE; avgRating: number; ratingCount: number }[]
  } = await response.json()
  return data.data
}

export const relatedProductAction = async ({ id }: { id: string }) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/public/retrieve-rating/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  const data: {
    data: {
      rating: { rating: number; count: number; percentage: number }[]
      review: {
        reviews: string | null
        name: string
        img: string | null
        createdAt: Date
        rating: number
      }[]
      category: {
        products: PRODUCT_TYPE[]
      }
    }
  } = await response.json()

  return data.data
}

export const getArrayProductsAction = async ({ ids }: { ids: string[] }) => {
  const params = new URLSearchParams()
  ids.forEach((id) => {
    if (id !== undefined && id !== null) {
      params.append("ids", id)
    }
  })

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/public/get-array-products?${params.toString()}`,
    { method: "GET" }
  )
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  const data: {
    data: { products: PRODUCT_TYPE; avgRating: number; ratingCount: number }[]
  } = await response.json()
  return data.data
}
