export type ORDER_TYPE = {
  id: string
  email: string
  createdAt: Date
  updatedAt: Date
  phone: string | null
  totalPrice: number
  isPaid: boolean
  paymentIntent: string | null
  line1: string | null
  postalCode: string | null
  city: string | null
  state: string | null
  country: string | null
}
export type ORDER_STATUS_TYPE =
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED"

export type ORDER_ITEMS_TYPE = {
  id: string
  createdAt: Date
  updatedAt: Date
  size: string | null
  status: ORDER_STATUS_TYPE
  color: string | null
  price: number
  productId: string
  orderId: string
  quantity: number
  usedCoupon: boolean
}
