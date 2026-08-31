import { seed } from "drizzle-seed"
import { db } from "."
import { products } from "./schema/products.schema"
import { orderItems, orders } from "./schema/order.schema"

async function main() {
  await seed(db, { orderItems }).refine((f) => ({
    orderItems: {
      count: 50,
      columns: {
        color: f.default({ defaultValue: null }),
        orderId: f.valuesFromArray({
          values: [
            "010c6f4f-8c3b-4377-7d73-5c06d4e1ac7b",
            "10476b01-eb4d-4d78-652e-bbc38590e702",
            "206716cd-0f55-4c60-f012-ee52b0744723",
            "23dca294-674f-4b30-2d04-ad8c7da5737b",
            "345ca6c1-138c-4d30-2ffa-84ae08885519",
            "3cfb72fb-a1a3-4abb-84dd-1c519c71bb47",
            "437e6fd1-526f-4252-6b30-57d736c57ac8",
            "480ff10d-c17a-4628-2057-40ba4519e803",
            "57c7f31d-948e-45fa-7b62-90af95b09ff6",
            "6565dfb9-6450-4d1b-9bcb-19616a1ad232",
            "74767b95-71b1-4b05-4fdc-693678c2d195",
            "8287dd49-b081-44d5-fec1-6bcc7a3e2a1e",
            "9afb4b5c-0728-4ce6-60d0-3aeaa781abbc",
            "9fccfb09-170a-454f-0113-0f7956412860",
            "c5619d8a-fdf2-4f60-0a21-0d12646d778f",
            "da4cd2d6-38d4-4015-2408-02723ee3a234",
            "e90c0e82-3025-4063-8d88-6f9ce50df317",
            "edd9276b-92c8-4c3b-d81d-bd8b1cdab632",
            "f4b83bf5-7277-471b-e585-6d2e76130c5b",
            "ffcffa50-9262-4552-d653-3525c1c8c28d",
          ],
        }),
        price: f.number({ minValue: 7, maxValue: 100, precision: 2 }),
        createdAt: f.date({ minDate: "2026-01-01", maxDate: "2026-08-27" }),
        quantity: f.int({ maxValue: 6, minValue: 1 }),
        size: f.default({ defaultValue: null }),
        productId: f.valuesFromArray({
          values: [
            "010c6f4f-8c3b-4377-7d73-5c06d4e1ac7b",
            "10476b01-eb4d-4d78-652e-bbc38590e702",
            "206716cd-0f55-4c60-f012-ee52b0744723",
            "23dca294-674f-4b30-2d04-ad8c7da5737b",
            "33dece2c-aa18-4f3b-9944-cd24fa6c938b",
            "345ca6c1-138c-4d30-2ffa-84ae08885519",
            "3cfb72fb-a1a3-4abb-84dd-1c519c71bb47",
            "437e6fd1-526f-4252-6b30-57d736c57ac8",
            "480ff10d-c17a-4628-2057-40ba4519e803",
            "57c7f31d-948e-45fa-7b62-90af95b09ff6",
            "6565dfb9-6450-4d1b-9bcb-19616a1ad232",
            "74767b95-71b1-4b05-4fdc-693678c2d195",
            "8287dd49-b081-44d5-fec1-6bcc7a3e2a1e",
            "9afb4b5c-0728-4ce6-60d0-3aeaa781abbc",
            "9fccfb09-170a-454f-0113-0f7956412860",
            "c5619d8a-fdf2-4f60-0a21-0d12646d778f",
            "da4cd2d6-38d4-4015-2408-02723ee3a234",
            "e90c0e82-3025-4063-8d88-6f9ce50df317",
            "edd9276b-92c8-4c3b-d81d-bd8b1cdab632",
            "f4b83bf5-7277-471b-e585-6d2e76130c5b",
            "ffcffa50-9262-4552-d653-3525c1c8c28d",
          ],
        }),
      },
    },
  }))
}
main()

// ? This seed created by drizzle
// to run db seed use bun db:seed
