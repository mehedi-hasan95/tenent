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

export const boostingCoin = pgTable("boosting_coin", {
  id: uuid().defaultRandom().primaryKey(),
  coin: real().notNull(),
  isActive: boolean("is_active").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const vendorCoin = pgTable(
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

export const vendorCoinPurchase = pgTable(
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

export const vendorCoinRelations = relations(vendorCoin, ({ one }) => ({
  user: one(user, {
    fields: [vendorCoin.email],
    references: [user.email],
  }),
}))

export const vendorCoinPurchaseRelations = relations(
  vendorCoinPurchase,
  ({ one }) => ({
    user: one(user, {
      fields: [vendorCoinPurchase.email],
      references: [user.email],
    }),
  })
)

export const productBoost = pgTable(
  "product_boost",
  {
    id: uuid().defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    coins: real().notNull(),
    ...timestamps,
    endAt: timestamp("end_at"),
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

export const productBoostRelations = relations(productBoost, ({ one }) => ({
  product: one(products, {
    fields: [productBoost.productId],
    references: [products.id],
  }),
  user: one(user, {
    fields: [productBoost.userId],
    references: [user.id],
  }),
}))
