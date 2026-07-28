import { relations } from "drizzle-orm"
import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { products } from "./products.schema"
import { timestamps } from "./columns.helpers"

export const categories = pgTable(
  "categories",
  {
    id: uuid().defaultRandom().primaryKey(),
    name: text().notNull(),
    slug: text().unique().notNull(),
    image: text(),
    ...timestamps,
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [index("category_slug_ids").on(table.slug)]
)

export const subCategories = pgTable(
  "sub-categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    ...timestamps,
    deletedAt: timestamp("deleted_at"),
    name: text().notNull(),
    slug: text().unique().notNull(),
    categorySlug: text("category_slug")
      .notNull()
      .references(() => categories.slug, { onDelete: "cascade" }),
  },
  (t) => [index("subCategory_slug_ids").on(t.slug)]
)

// relations
export const categoryRelation = relations(categories, ({ many }) => ({
  subCategory: many(subCategories),
}))

export const subCategoriesRelation = relations(subCategories, ({ one }) => ({
  categories: one(categories, {
    fields: [subCategories.categorySlug],
    references: [categories.slug],
  }),
}))

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}))

export const subCategoriesRelations = relations(subCategories, ({ many }) => ({
  products: many(products),
}))
