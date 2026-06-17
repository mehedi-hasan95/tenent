import { db } from "@workspace/db"
import { betterAuth, BetterAuthOptions } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { account, user } from "@workspace/db/schema/user.schema"
import redis from "@workspace/redis"
import { customSession, emailOTP, username } from "better-auth/plugins"
import { sendVerificationEmail } from "@workspace/email-service/email/send-verification-email"

const options = {
  baseURL: process.env.BETTER_AUTH_URL,

  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { account, user },
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    maxPasswordLength: 64,
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    async afterEmailVerification(user, request) {
      // Your custom logic here, e.g., grant access to premium features
      console.log(`${user.email} has been successfully verified!`)
    },
  },

  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          await sendVerificationEmail("verification", email, otp)
        }
        if (type === "forget-password") {
          await sendVerificationEmail("reset", email, otp)
        }
      },
      disableSignUp: false,
    }),
    username({
      minUsernameLength: 3,
      maxUsernameLength: 64,
    }),
  ],
  advanced: {
    defaultCookieAttributes: {
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      partitioned: false,
    },
    cookies: {
      sessionToken: {
        attributes: {
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          secure: process.env.NODE_ENV === "production",
          partitioned: false,
        },
      },
    },
  },
  user: {
    additionalFields: {
      role: {
        type: ["USER", "SELLER", "ADMIN"],
        required: false,
        defaultValue: "USER",
      },
      phone: {
        type: "string",
        required: false,
        defaultValue: undefined,
      },
      stripeVerified: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
    },
  },
  secondaryStorage: {
    get: async (key) => {
      return await redis.get(key)
    },
    set: async (key, value, ttl) => {
      if (ttl) {
        await redis.set(key, value, "EX", ttl)
      } else {
        await redis.set(key, value)
      }
    },
    delete: async (key) => {
      await redis.del(key)
    },
  },
  trustedOrigins: [process.env.TRUSTED_ORIGIN ?? "http://localhost:3000"],
} satisfies BetterAuthOptions

export const auth = betterAuth({
  ...options,
  plugins: [
    ...(options.plugins ?? []),
    customSession(async ({ user, session }, ctx) => {
      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          stripeVerified: user.stripeVerified,
        },
        session: { token: session.token },
      }
    }, options),
  ],
})
