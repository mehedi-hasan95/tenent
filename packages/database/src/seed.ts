import { seed } from "drizzle-seed"
import { db } from "."
import { orderItems } from "./schema/order.schema"

const orderId = [
  "010c6f4f-8c3b-4377-7d73-5c06d4e1ac7b",
  "10476b01-eb4d-4d78-652e-bbc38590e702",
  "345ca6c1-138c-4d30-2ffa-84ae08885519",
  "3cfb72fb-a1a3-4abb-84dd-1c519c71bb47",
  "74767b95-71b1-4b05-4fdc-693678c2d195",
  "9fccfb09-170a-454f-0113-0f7956412860",
  "c5619d8a-fdf2-4f60-0a21-0d12646d778f",
  "da4cd2d6-38d4-4015-2408-02723ee3a234",
  "f4b83bf5-7277-471b-e585-6d2e76130c5b",
  "ffcffa50-9262-4552-d653-3525c1c8c28d",
]
const productId = [
  "03280019-f67f-4bf4-9833-cfe67462ad39",
  "0616c167-d665-49d1-ad30-7ebd7dc7af06",
  "0faa29b9-6354-4b66-a027-39d5737fa577",
  "16787513-a23f-4845-bb72-feb62729ddfc",
  "1b111d45-5f56-464a-a983-2460303c410b",
  "1b35b479-ff4f-412b-a573-aea5380cd291",
  "1f781d1d-8cc6-4c60-a774-1edaffdc59ef",
  "24338190-22bf-42cc-a566-2930a653468f",
  "32933507-c011-48af-a22f-8e8b5bac70dd",
  "3469b1fd-ba99-45ed-8e89-95b394eab766",
]

async function main() {
  await seed(db, { orderItems }).refine((f) => ({
    orderItems: {
      count: 40,
      columns: {
        createdAt: f.date({ minDate: "2026-01-01", maxDate: "2026-08-13" }),
        orderId: f.valuesFromArray({ values: orderId }),
        price: f.number({ minValue: 7, maxValue: 100, precision: 2 }),
        productId: f.valuesFromArray({ values: productId }),
        quantity: f.int({ minValue: 1, maxValue: 4 }),
        status: f.valuesFromArray({
          values: ["PROCESSING", "SHIPPED", "DELIVERED"],
        }),
        usedCoupon: f.valuesFromArray({ values: [true, false] }),
        updatedAt: f.date({ minDate: "2026-01-01", maxDate: "2026-08-13" }),
        color: f.default({ defaultValue: null }),
        size: f.default({ defaultValue: null }),
      },
    },
  }))
}
main()

// ? This seed created by drizzle
// to run db seed use bun db:seed
