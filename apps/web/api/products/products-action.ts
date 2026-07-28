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
    data: (BOOSTED_PRODUCT_TYPE & { product: PRODUCT_TYPE })[]
  } = await response.json()
  return data.data
}
