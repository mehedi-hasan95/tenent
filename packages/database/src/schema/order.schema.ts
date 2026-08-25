import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  real,
  text,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"
import { timestamps } from "./columns.helpers"
import { user } from "./user.schema"
import { products } from "./products.schema"
import { relations } from "drizzle-orm"

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text()
      .notNull()
      .references(() => user.email),
    totalPrice: real("total_price").notNull(),
    isPaid: boolean("is_paid").default(false).notNull(),
    paymentIntent: varchar("payment_intent", { length: 255 }),
    line1: varchar("line1", { length: 255 }),
    postalCode: varchar("postal_code", { length: 50 }),
    city: varchar("city", { length: 100 }),
    state: varchar("state", { length: 100 }),
    phone: varchar("phone", { length: 30 }),
    country: varchar("country", { length: 100 }),
    ...timestamps,
  },
  (table) => [index("order_user_email_idx").on(table.email)]
)

export const orderEnum = pgEnum("order_enum", [
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
])

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    productId: uuid("product_id")
      .notNull()
      .references(() => products.id),

    price: real("price").notNull(),

    quantity: integer("quantity").default(1).notNull(),

    size: varchar("size", { length: 50 }),

    color: varchar("color", { length: 50 }),

    usedCoupon: varchar("used_coupon"),

    status: orderEnum("status").default("PROCESSING").notNull(),

    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, {
        onDelete: "cascade",
      }),

    ...timestamps,
  },
  (table) => [
    index("order_items_order_id_idx").on(table.orderId),
    index("order_items_product_id_idx").on(table.productId),
    index("order_items_status_idx").on(table.status),
  ]
)

export const ratings = pgTable(
  "ratings",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    productId: uuid("product_id")
      .notNull()
      .references(() => products.id),

    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id),
    email: varchar()
      .notNull()
      .references(() => user.email),
    rating: integer().notNull(),
    reviews: varchar({ length: 400 }),
    ...timestamps,
  },
  (table) => [
    index("ratings_product_id_idx").on(table.productId),
    index("ratings_order_id_idx").on(table.orderId),
    index("ratings_email_idx").on(table.email),
    uniqueIndex("ratings_order_product_unique").on(
      table.orderId,
      table.productId
    ),
  ]
)

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(user, {
    fields: [orders.email],
    references: [user.email],
  }),

  orderItems: many(orderItems),
  ratings: many(ratings),
}))
export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),

  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}))

export const ratingsRelations = relations(ratings, ({ one }) => ({
  product: one(products, {
    fields: [ratings.productId],
    references: [products.id],
  }),

  order: one(orders, {
    fields: [ratings.orderId],
    references: [orders.id],
  }),

  user: one(user, {
    fields: [ratings.email],
    references: [user.email],
  }),
}))
