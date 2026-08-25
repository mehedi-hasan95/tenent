export type PRODUCT_TYPE = {
  tags: string[] | null
  description: string
  type: "physical" | "digital" | "service"
  id: string
  title: string
  createdAt: Date
  updatedAt: Date | null
  shortDescription: string
  basePrice: number
  salePrice: number
  stock: number | null
  totalSale: number
  weight: number | null
  status: "draft" | "active" | "archived"
  images: string[]
  deletedAt: Date | null
  categorySlug: string
  subCategorySlug: string
  color: string[] | null
  specification: unknown
  cashOnDelivery: boolean
  sizes: string[] | null
  userEmail: string
}

export type COUPON_TYPE = {
  id: string
  code: string | null
  createdAt: Date
  updatedAt: Date
  productId: string
  discountPercent: number | null
  flatDiscount: number | null
  isActive: boolean
  expiresAt: Date | null
  maxRedemptions: number | null
  timesRedeemed: number
  minOrderAmount: number | null
}
