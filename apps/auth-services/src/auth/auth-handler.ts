import { RouteHandler } from "@workspace/open-api"
import {
  registrationEmailVerifyOTPRoute,
  registrationEmailVerifyRoute,
  registrationRoute,
} from "./auth-route"
import { auth } from "@workspace/auth"

export const registrationHandler: RouteHandler<
  typeof registrationRoute
> = async (c) => {
  const { email, name, password, role, phone, username } = c.req.valid("json")
  try {
    const data = await auth.api.signUpEmail({
      body: {
        email,
        name,
        password,
        role,
        phone,
        username: username || undefined,
      },
    })
    return c.json({ data }, 201)
  } catch (error) {
    return c.json({ error })
  }
}

export const registrationEmailVerifyHandler: RouteHandler<
  typeof registrationEmailVerifyRoute
> = async (c) => {
  try {
    const { email } = c.req.valid("json")
    const data = await auth.api.sendVerificationOTP({
      body: { email, type: "email-verification" },
    })
    return c.json({ data }, 201)
  } catch (error) {
    return c.json({ error })
  }
}

export const registrationEmailVerifyOTPHandler: RouteHandler<
  typeof registrationEmailVerifyOTPRoute
> = async (c) => {
  try {
    const { email, otp } = c.req.valid("json")
    const data = await auth.api.verifyEmailOTP({
      body: {
        email,
        otp,
      },
    })
    return c.json({ data }, 200)
  } catch (error) {
    return c.json({ error })
  }
}
