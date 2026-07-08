import { DEFAULT_SIZE } from "@workspace/validators/types/constants.types"

// export const dataQueryKey = (
//   user: string | null,
//   size = 10,
// ) => ["data", user, size] as const;

export const CACHE_ALL_PRODUCTS_KEYS = (size = DEFAULT_SIZE) =>
  ["products", size] as const

export const CACHE_BOOSTING_COIN_KEYS = ["boosting"] as const
