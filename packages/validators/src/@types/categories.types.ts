export type categoriesType = {
  id: string
  name: string
  slug: string
  image: string | null
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export type subCategoriesType = {
  name: string
  slug: string
  categorySlug: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  id: string
}
