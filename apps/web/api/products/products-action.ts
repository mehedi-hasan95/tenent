import { BOOSTED_PRODUCT_TYPE } from "@workspace/validators/types/boosting.types"
import { PRODUCT_TYPE } from "@workspace/validators/types/product.types"
import {
  productListQuerySchema,
  productValidator,
} from "@workspace/validators/validators/products-validators"
import z from "zod"

export const boostedProductsAction = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/common/boosted-products`,
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
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/common/single-products`
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

// type FetchAllProductsParams = z.infer<typeof productsValidators>

// export const fetchAllProductsAction = async ({
//   seller,
//   cursor,
//   pageSize = 10,
//   search,
//   maxPrice,
//   minPrice,
// }: FetchAllProductsParams ) => {
//   const params = new URLSearchParams()

//   Object.entries({ seller, cursor, search, minPrice, maxPrice }).forEach(
//     ([key, value]) => {
//       if (value !== undefined && value !== null) {
//         params.set(key, String(value))
//       }
//     }
//   )

//   params.set("pageSize", String(pageSize))

//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/common/all-products?${params.toString()}`,
//     {
//       method: "GET",
//     }
//   )

//   if (!response.ok) {
//     throw await response.json()
//   }

//   return response.json()
// }

export const fetchAllProductsAction = async (
  data: z.infer<typeof productListQuerySchema> & { cats?: string[] }
) => {
  const params = new URLSearchParams()
  // const { seller, cursor, search, minPrice, maxPrice, pageSize,cats } = data

  // Object.entries({ seller, cursor, search, minPrice, maxPrice }).forEach(
  //   ([key, value]) => {
  //     if (value !== undefined && value !== null) {
  //       params.set(key, String(value))
  //     }
  //   }
  // )

  // params.set("pageSize", String(pageSize))

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.set(key, Array.isArray(value) ? value.join(",") : String(value))
    }
  })

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/common/all-products?${params.toString()}`,
    {
      method: "GET",
    }
  )

  if (!response.ok) {
    throw await response.json()
  }

  return response.json()
}
