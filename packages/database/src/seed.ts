import { seed } from "drizzle-seed"
import { db } from "."
import { products } from "./schema/products.schema"

const id = "7aoBWgrY3"
const subCat = ["0gq8Q79dco4tsstR", "6mhHfvo98yqD", "4jgRRb15oAAy"]
const user = ["certain_aaronjoshua@gmail.com", "topexo7972@meikeya.com"]
const img = [
  [
    "https://images.unsplash.com/photo-1534008757030-27299c4371b6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ],
]
async function main() {
  await seed(db, { products }).refine((f) => ({
    products: {
      count: 20,
      columns: {
        categorySlug: f.default({ defaultValue: id }),
        userEmail: f.valuesFromArray({ values: user }),
        subCategorySlug: f.valuesFromArray({ values: subCat }),
        images: f.default({ defaultValue: img }),
        basePrice: f.number({ minValue: 10, maxValue: 700, precision: 2 }),
        salePrice: f.number({ minValue: 10, maxValue: 700, precision: 2 }),
        stock: f.int({ minValue: 90, maxValue: 140 }),
        weight: f.number({ minValue: 0.25, maxValue: 20, precision: 2 }),
      },
    },
  }))
}
main()
