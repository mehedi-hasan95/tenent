import { BOOSTED_PRODUCT_TYPE } from "@workspace/validators/types/boosting.types"
import { PRODUCT_TYPE } from "@workspace/validators/types/product.types"

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
