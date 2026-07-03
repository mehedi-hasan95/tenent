export type PRODUCT_TYPE = {
  tags: string[] | null
  description: string
  type: "physical" | "digital" | "service"
  id: string
  title: string
  created_at: Date
  updated_at: Date | null
  shortDescription: string
  basePrice: number
  salePrice: number
  stock: number
  weight: number | null
  status: "draft" | "active" | "archived"
  images: string[]
  deleted_at: Date | null
  categorySlug: string
  subCategorySlug: string
  color: string[] | null
  specification: unknown
  cashOnDelivery: boolean
  coupon: string | null
  sizes: string[] | null
  userEmail: string
}
