import { seed } from "drizzle-seed"
import { db } from "."
import { products } from "./schema/products.schema"

const title = [
  "GlowNest LED Lamp",
  "SmartSip Water Bottle",
  "FlexiCharge Power Bank",
  "AirPure Mini Humidifier",
  "CozyCloud Pillow",
  "SnapFit Phone Stand",
  "FreshBox Food Container",
  "LuxeGlow Skincare Set",
  "EasyBrew Coffee Maker",
  "FitPulse Smart Band",
  "SoundBeat Wireless Earbuds",
  "ChillMate Mini Fan",
  "CleanPro Electric Scrubber",
  "StyleVault Travel Bag",
  "HomeEase Storage Organizer",
  "PureTouch Hand Wash Dispenser",
  "BrightBeam Desk Light",
  "SleepZen Eye Mask",
  "QuickBlend Portable Blender",
  "UrbanFlex Casual Backpack",
  "FreshStep Shoe Cleaner",
  "CalmWave Aroma Diffuser",
  "PowerNest Charging Station",
  "TrendyLoop Fashion Watch",
  "EcoCarry Reusable Shopping Bag",
]

const images = [
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
  "https://images.unsplash.com/photo-1602143407151-7111542de6e8",
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7",
  "https://images.unsplash.com/photo-1583394838336-acd977736f90",
  "https://images.unsplash.com/photo-1556228578-8c89e6adf883",
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
  "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
  "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85",
  "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446",
]

async function main() {
  await seed(db, { products }).refine((f) => ({
    products: {
      count: 22,
      columns: {
        basePrice: f.number({ minValue: 7, maxValue: 100, precision: 2 }),
        createdAt: f.date({ minDate: "2026-01-01", maxDate: "2026-08-27" }),
        updatedAt: f.date({ minDate: "2026-01-01", maxDate: "2026-08-27" }),
        categorySlug: f.valuesFromArray({ values: ["home-and-kitchen"] }),
        subCategorySlug: f.valuesFromArray({ values: ["kitchen-appliances"] }),
        salePrice: f.number({ minValue: 7, maxValue: 100, precision: 2 }),
        status: f.default({ defaultValue: "active" }),
        description: f.default({ defaultValue: "<p>Test&nbsp;1</p>" }),
        userEmail: f.default({ defaultValue: "m@m.com" }),
        title: f.valuesFromArray({ values: title }),
        stock: f.int({ minValue: 100, maxValue: 400 }),
        totalSale: f.int({ minValue: 10, maxValue: 30 }),
        weight: f.default({ defaultValue: null }),
        sizes: f.valuesFromArray({
          values: ["SM", "MD", "LG", "XL", "XXL", "XXXL"],
          arraySize: 3,
        }),
        images: f.valuesFromArray({
          values: images,
          arraySize: 2,
        }),
        deletedAt: f.default({ defaultValue: null }),
      },
    },
  }))
}
main()

// ? This seed created by drizzle
// to run db seed use bun db:seed
