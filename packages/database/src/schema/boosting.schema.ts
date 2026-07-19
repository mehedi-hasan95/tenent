import {
  boolean,
  index,
  pgTable,
  real,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core"
import { user } from "./user.schema"
import { timestamps } from "./columns.helpers"
import { relations } from "drizzle-orm"

export const boosting_coin = pgTable("boosting_coin", {
  id: uuid().defaultRandom().primaryKey(),
  coin: real(),
  is_active: boolean().default(false),
  created_at: timestamp().defaultNow().notNull(),
})

export const vendor_coin = pgTable(
  "vendor_coin",
  {
    id: uuid().defaultRandom().primaryKey(),
    coin: real(),
    email: text("email")
      .notNull()
      .references(() => user.email, {
        onDelete: "cascade",
      }),
    ...timestamps,
  },
  (table) => [uniqueIndex("vendor_email").on(table.email)]
)

export const vendor_coin_purchase = pgTable(
  "vendor_coin_purchase",
  {
    id: uuid().defaultRandom().primaryKey(),
    coin: real(),
    price: real(),
    email: text("email")
      .notNull()
      .references(() => user.email, {
        onDelete: "cascade",
      }),
    ...timestamps,
  },
  (table) => [index("vendor_purchase_email").on(table.email)]
)

// relations

export const vendor_coin_relations = relations(vendor_coin, ({ one }) => ({
  user: one(user, {
    fields: [vendor_coin.email],
    references: [user.email],
  }),
}))

export const vendor_coin_purchase_relations = relations(
  vendor_coin_purchase,
  ({ one }) => ({
    user: one(user, {
      fields: [vendor_coin_purchase.email],
      references: [user.email],
    }),
  })
)
