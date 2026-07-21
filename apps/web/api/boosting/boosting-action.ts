import {
  VENDOR_COIN_HISTORY_TYPE,
  VENDOR_COIN_TYPE,
} from "@workspace/validators/types/boosting.types"
import { PAGINATION_TYPES } from "@workspace/validators/types/constants.types"

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
    data: VENDOR_COIN_TYPE | undefined
  } = await response.json()
  return data.data
}
