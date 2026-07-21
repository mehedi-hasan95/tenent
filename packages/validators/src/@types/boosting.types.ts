export type BOOSTING_COIN_TYPE = {
  id: string
  coin: number
  created_at: Date
  is_active: boolean | null
}

export type VENDOR_COIN_TYPE = {
  id: string
  coin: number
  email: string
  created_at: Date
  updated_at: Date | null
}

export type VENDOR_COIN_HISTORY_TYPE = {
  id: string
  coin: number
  email: string
  created_at: Date
  updated_at: Date | null
  price: number
}
