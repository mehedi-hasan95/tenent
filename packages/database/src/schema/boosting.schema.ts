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
import { products } from "./products.schema"

export const boosting_coin = pgTable("boosting_coin", {
  id: uuid().defaultRandom().primaryKey(),
  coin: real().notNull(),
  is_active: boolean().default(false),
  created_at: timestamp().defaultNow().notNull(),
})

export const vendor_coin = pgTable(
  "vendor_coin",
  {
    id: uuid().defaultRandom().primaryKey(),
    coin: real().notNull(),
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
    coin: real().notNull(),
    price: real().notNull(),
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

export const product_boost = pgTable(
  "product_boost",
  {
    id: uuid().defaultRandom().primaryKey(),
    productId: uuid()
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    coins: real().notNull(),
    ...timestamps,
    endAt: timestamp(),
  },
  (table) => [
    index("product_boosts_product_idx").on(table.productId),
    index("product_boosts_user_idx").on(table.userId),
    uniqueIndex("product_boosts_user_product_unique").on(
      table.productId,
      table.endAt
    ),
  ]
)

// relations

export const productBoostRelations = relations(product_boost, ({ one }) => ({
  product: one(products, {
    fields: [product_boost.productId],
    references: [products.id],
  }),
  user: one(user, {
    fields: [product_boost.userId],
    references: [user.id],
  }),
}))
