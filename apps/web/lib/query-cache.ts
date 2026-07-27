import { DEFAULT_SIZE } from "@workspace/validators/types/constants.types"

export const CACHE_ALL_PRODUCTS_KEYS = (size = DEFAULT_SIZE) =>
  ["products", size] as const

export const CACHE_BOOSTING_COIN_KEYS = ["boosting"] as const
export const CACHE_SELLER_PRODUCTS_KEYS = ["seller-products"] as const
export const CACHE_BUY_BOOSTING_COIN = ["buy-boosting-coin"] as const
export const CACHE_VENDOR_AVAILABLE_BOOSTING_COIN = [
  "vendor-available-boosting",
] as const

export const CACHE_VENDOR_BOOSTED_PRODUCTS = [
  "vendor-boosted-products",
] as const

export const CACHE_COIN_PURCHASE_HISTORY = ({
  page = 1,
  size = DEFAULT_SIZE,
}: {
  page?: number
  size?: number
}) => ["coinPurchaseHistory", page, size] as const
