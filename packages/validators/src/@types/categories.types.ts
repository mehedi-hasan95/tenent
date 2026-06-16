export type categoriesType = {
  id: string
  name: string
  slug: string
  image: string | null
  createdAt: Date
  updatedAt: Date
  deleted_at: Date | null
}

export type subCategoriesType = {
  name: string
  slug: string
  categorySlug: string
  createdAt: Date
  updatedAt: Date
  deleted_at: Date | null
  id: string
}
