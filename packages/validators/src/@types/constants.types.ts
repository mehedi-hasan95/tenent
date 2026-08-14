export type apiError = {
  errors?: {
    code?: string | number
    message?: string
  }[]
}

export const DELIVERY_ENUM = ["physical", "digital", "service"] as const

export const STATUS_ENUM = ["draft", "active", "archived"] as const
export const PRODUCTS_STATUS_ENUM = ["draft", "active", "archived"] as const

export const DEFAULT_SIZE = 10

export type PAGINATION_TYPES = {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export const sortValues = [
  "default",
  "old",
  "new",
  "ascByName",
  "dscByName",
  "ascByPrice",
  "dscByPrice",
] as const
