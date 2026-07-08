import { boolean, integer, pgTable, timestamp, uuid } from "drizzle-orm/pg-core"

export const boosting_coin = pgTable("boosting_coin", {
  id: uuid().defaultRandom().primaryKey(),
  coin: integer(),
  is_active: boolean().default(false),
  created_at: timestamp().defaultNow().notNull(),
})
