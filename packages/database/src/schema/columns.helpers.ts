import { timestamp } from "drizzle-orm/pg-core"

export const timestamps = {
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}
