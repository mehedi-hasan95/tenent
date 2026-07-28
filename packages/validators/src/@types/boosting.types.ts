export type BOOSTING_COIN_TYPE = {
  id: string
  coin: number
  createdAt: Date
  is_active: boolean | null
}

export type VENDOR_COIN_TYPE = {
  id: string
  coin: number
  email: string
  createdAt: Date
  updatedAt: Date | null
}

export type VENDOR_COIN_HISTORY_TYPE = {
  id: string
  coin: number
  email: string
  createdAt: Date
  updatedAt: Date | null
  price: number
}

export type BOOSTED_PRODUCT_TYPE = {
  id: string
  createdAt: Date
  updatedAt: Date
  userId: string
  productId: string
  coins: number
  endAt: Date | null
}
