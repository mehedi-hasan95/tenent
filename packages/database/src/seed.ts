import { seed } from "drizzle-seed"
import { db } from "."
import { products } from "./schema/products.schema"

async function main() {
  await seed(db, { products }).refine((f) => ({
    products: {
      count: 10,
      columns: {
        // createdAt: f.date({ minDate: "2026-01-01", maxDate: "2026-08-13" }),
        // orderId: f.valuesFromArray({ values: orderId }),
        // price: f.number({ minValue: 7, maxValue: 100, precision: 2 }),
        // productId: f.valuesFromArray({ values: productId }),
        // quantity: f.int({ minValue: 1, maxValue: 4 }),
        // status: f.valuesFromArray({
        //   values: ["PROCESSING", "SHIPPED", "DELIVERED"],
        // }),
        // usedCoupon: f.valuesFromArray({ values: [true, false] }),
        // updatedAt: f.date({ minDate: "2026-01-01", maxDate: "2026-08-13" }),
        // color: f.default({ defaultValue: null }),
        // size: f.default({ defaultValue: null }),
        basePrice: f.number({ minValue: 7, maxValue: 100, precision: 2 }),
        createdAt: f.date({ minDate: "2026-01-01", maxDate: "2026-08-27" }),
        updatedAt: f.date({ minDate: "2026-01-01", maxDate: "2026-08-27" }),
        categorySlug: f.valuesFromArray({ values: ["home-and-kitchen"] }),
        subCategorySlug: f.valuesFromArray({ values: ["kitchen-appliances"] }),
        salePrice: f.number({ minValue: 7, maxValue: 100, precision: 2 }),
        status: f.default({ defaultValue: "active" }),
        description: f.default({ defaultValue: "<p>Test&nbsp;1</p>" }),
        userEmail: f.default({ defaultValue: "m@m.com" }),
      },
    },
  }))
}
main()

// ? This seed created by drizzle
// to run db seed use bun db:seed
