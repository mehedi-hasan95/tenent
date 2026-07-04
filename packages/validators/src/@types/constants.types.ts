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
