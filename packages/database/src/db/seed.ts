import { db } from ".."
import { products } from "../schema/products.schema"
import categoryData from "./data/products.json"

const seedData = categoryData.map((category) => {
  const {
    createdAt,
    updatedAt,
    deletedAt,
    short_description,
    base_price,
    sale_price,
    category_slug,
    sub_category_slug,
    ...rest
  } = category as any

  return {
    ...rest,
    createdAt: new Date(createdAt),
    updatedAt: new Date(updatedAt),
    deletedAt: deletedAt ? new Date(deletedAt) : undefined,
    shortDescription: short_description,
    basePrice: base_price,
    salePrice: sale_price,
    categorySlug: category_slug,
    subCategorySlug: sub_category_slug,
  }
})

async function seed() {
  console.log("🌱 Seeding categories...")

  await db.insert(products).values(seedData)

  console.log("✅ Categories seeded successfully")
}

seed().catch((error) => {
  console.error("❌ Seed failed:", error)
  process.exit(1)
})

// ? This seed for my created
