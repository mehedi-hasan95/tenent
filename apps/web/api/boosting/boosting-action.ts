import {
  BOOSTED_PRODUCT_TYPE,
  VENDOR_COIN_HISTORY_TYPE,
  VENDOR_COIN_TYPE,
} from "@workspace/validators/types/boosting.types"
import { PAGINATION_TYPES } from "@workspace/validators/types/constants.types"
import { PRODUCT_TYPE } from "@workspace/validators/types/product.types"
import { productBoostingValidator } from "@workspace/validators/validators/boosting-validators"
import z from "zod"

// *example: query
export const getCoinPurchaseHistoryAction = async ({
  page,
  limit,
}: {
  page?: number
  limit?: number
}) => {
  const params = new URLSearchParams(
    Object.entries({ page, limit }).map(([k, v]) => [k, String(v)])
  )
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/boosting/coin-purchase-history?${params}`,
    {
      method: "GET",
      credentials: "include",
    }
  )
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  const data: {
    data: VENDOR_COIN_HISTORY_TYPE[]
    pagination: PAGINATION_TYPES
  } = await response.json()
  return data
}

export const getVendorCoinAction = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/boosting/vendor-coin`,
    {
      method: "GET",
      credentials: "include",
    }
  )
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  const data: {
    data: VENDOR_COIN_TYPE | null
  } = await response.json()
  return data.data
}

export const productBoostingAction = async (
  data: z.input<typeof productBoostingValidator>
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/boosting/product-boosting`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    }
  )
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  return response.json()
}

export const vendorAllBoostedProductsAction = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCTS_URL}/boosting/all-boosted-products`,
    {
      method: "GET",
      credentials: "include",
    }
  )
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  const data: {
    data: (BOOSTED_PRODUCT_TYPE & { product: PRODUCT_TYPE })[]
    pagination: PAGINATION_TYPES
  } = await response.json()
  return data
}
