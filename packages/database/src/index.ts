import "dotenv/config"
import { drizzle } from "drizzle-orm/node-postgres"
import * as schema from "./schema/index.schema"

export const db = drizzle(process.env.DATABASE_URL!, { schema })

export * from "drizzle-orm"
