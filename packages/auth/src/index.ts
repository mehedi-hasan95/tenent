import { db } from "@workspace/db"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { account, session, user } from "@workspace/db/schema/users"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, account, session },
  }),
  emailAndPassword: {
    enabled: true,
  },
})
