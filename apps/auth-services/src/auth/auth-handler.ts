import { RouteHandler } from "@workspace/open-api"
import {
  loginRoute,
  registrationEmailVerifyOTPRoute,
  registrationEmailVerifyRoute,
  registrationRoute,
  sessionRoute,
  signOutRoute,
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
    return await auth.api.verifyEmailOTP({
      body: {
        email,
        otp,
      },
      asResponse: true,
    })
  } catch (error) {
    return c.json({ error })
  }
}

export const loginHandler: RouteHandler<typeof loginRoute> = async (c) => {
  try {
    const { email, password, rememberMe } = c.req.valid("json")

    return await auth.api.signInEmail({
      body: {
        email,
        password,
        rememberMe,
      },
      asResponse: true, // returns a response object instead of data
    })
  } catch (error) {
    return c.json({ error })
  }
}

export const signOutHandler: RouteHandler<typeof signOutRoute> = async (c) => {
  await auth.api.signOut({
    headers: c.req.raw.headers,
  })
  return c.json({ success: true }, 200)
}

export const sessionHandler: RouteHandler<typeof sessionRoute> = async (c) => {
  const data = await auth.api.getSession({
    headers: c.req.raw.headers,
  })
  return c.json({ data })
}
