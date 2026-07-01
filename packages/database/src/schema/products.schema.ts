import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  real,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"
import { categories, subCategories } from "./categories.schema"
import { user } from "./user.schema"
import { timestamps } from "./columns.helpers"
import { relations } from "drizzle-orm"

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

    stock: integer("stock").notNull(),

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

    coupon: text("coupon"),

    sizes: text("sizes").array(),

    userEmail: text("user_email")
      .notNull()
      .references(() => user.email, {
        onDelete: "cascade",
      }),

    ...timestamps,
  },
  (table) => [index("products_id_idx").on(table.id)]
)

// =====================
// Relations
// =====================

export const productsRelations = relations(products, ({ one }) => ({
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
}))
