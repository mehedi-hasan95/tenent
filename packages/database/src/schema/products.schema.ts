import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"
import { categories, subCategories } from "./categories.schema"
import { user } from "./user.schema"
import { timestamps } from "./columns.helpers"
import { relations, sql } from "drizzle-orm"
import { productBoost } from "./boosting.schema"
import { orderItems, ratings } from "./order.schema"

export const productTypeEnum = pgEnum("product_type", [
  "physical",
  "digital",
  "service",
])

export const productStatusEnum = pgEnum("product_status", [
  "draft",
  "active",
  "archived",
])

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    title: varchar("title", { length: 255 }).notNull(),

    shortDescription: text("short_description").notNull(),

    basePrice: real("base_price").notNull(),

    salePrice: real("sale_price").notNull(),

    stock: integer("stock"),
    totalSale: integer("total_sale").notNull().default(0),

    tags: text("tags").array(),

    weight: real("weight"),

    type: productTypeEnum("type").default("physical").notNull(),

    status: productStatusEnum("status").default("draft").notNull(),

    images: text("images").array().notNull().default([]),

    categorySlug: text("category_slug")
      .notNull()
      .references(() => categories.slug, {
        onDelete: "cascade",
      }),

    subCategorySlug: text("sub_category_slug")
      .notNull()
      .references(() => subCategories.slug, {
        onDelete: "cascade",
      }),

    color: text("color").array(),

    specification: jsonb("specification"),

    description: text("description").notNull(),

    cashOnDelivery: boolean("cash_on_delivery").default(false).notNull(),

    sizes: text("sizes").array(),

    userEmail: text("user_email")
      .notNull()
      .references(() => user.email, {
        onDelete: "cascade",
      }),

    ...timestamps,
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    index("products_category_idx").on(table.categorySlug),
    index("products_subcategory_idx").on(table.subCategorySlug),
    index("products_status_idx").on(table.status),
    index("products_category_status_idx").on(table.categorySlug, table.status),
    index("products_user_email_idx").on(table.userEmail),
    index("products_created_at_idx").on(table.createdAt),
    index("products_sale_price_idx").on(table.salePrice),
    index("product_id_user_email_deleted_at_idx").on(
      table.id,
      table.userEmail,
      table.deletedAt
    ),
  ]
)

export const coupons = pgTable(
  "coupons",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: varchar("code", { length: 50 }),
    discountPercent: integer("discount_percent"),
    flatDiscount: real("flat_discount"),
    isActive: boolean("is_active").default(true).notNull(),
    expiresAt: timestamp("expires_at"),
    maxRedemptions: integer("max_redemptions"), // null = unlimited
    timesRedeemed: integer("times_redeemed").default(0).notNull(),
    minOrderAmount: real("min_order_amount"),
    productId: uuid("product_id")
      .notNull()
      .unique()
      .references(() => products.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("coupon_product_code_idx").on(table.productId, table.code),
    index("coupon_code_idx").on(table.code),
    check(
      "active_coupon_requires_code_and_one_discount",
      sql`NOT ${table.isActive} OR
    (
      ${table.code} IS NOT NULL AND
      ${table.code} != '' AND
      (
        (${table.discountPercent} IS NOT NULL AND ${table.flatDiscount} IS NULL) OR
        (${table.discountPercent} IS NULL AND ${table.flatDiscount} IS NOT NULL)
      )
    )`
    ),
  ]
)

// =====================
// Relations
// =====================

export const productsRelations = relations(products, ({ one, many }) => ({
  user: one(user, {
    fields: [products.userEmail],
    references: [user.email],
  }),

  category: one(categories, {
    fields: [products.categorySlug],
    references: [categories.slug],
  }),

  subCategory: one(subCategories, {
    fields: [products.subCategorySlug],
    references: [subCategories.slug],
  }),
  productsBoosts: many(productBoost),
  orderItems: many(orderItems),
  ratings: many(ratings),
  coupon: one(coupons),
}))

export const couponsRelations = relations(coupons, ({ one }) => ({
  product: one(products, {
    fields: [coupons.productId],
    references: [products.id],
  }),
}))
