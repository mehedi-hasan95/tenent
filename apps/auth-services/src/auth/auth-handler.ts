import { RouteHandler } from "@workspace/open-api"
import {
  checkVerificationOtpRoute,
  getSendEmailRoute,
  isPasswordVerifiedRoute,
  loginRoute,
  registrationEmailVerifyOTPRoute,
  registrationRoute,
  requestPasswordResetRoute,
  resetPasswordRoute,
  sessionRoute,
  setPasswordRoute,
  signOutRoute,
  updateUsernameRoute,
  updateUserRoute,
  userDetailsRoute,
  verifyEmailOtpRoute,
  verifyPasswordRoute,
} from "./auth-route"
import { auth } from "@workspace/auth"
import { db, eq } from "@workspace/db"
import { user } from "@workspace/db/schema/user.schema"
import { utapi } from "@workspace/uploadthing"
import { getSignedCookie, setSignedCookie } from "hono/cookie"
import { sign, verify } from "hono/jwt"
import { producer } from "../utils/kafka"

export const registrationHandler: RouteHandler<
  typeof registrationRoute
> = async (c) => {
  const { email, name, password, role, phone, username } = c.req.valid("json")
  try {
    const findUser = await db
      .selectDistinct()
      .from(user)
      .where(eq(user.email, email))
    if (findUser && findUser[0]?.emailVerified === false) {
      return c.json(
        {
          message: "Please verify you account",
          name: "unverified",
          email: findUser[0].email,
        },
        409
      )
    }
    if (findUser && findUser[0]?.emailVerified === true) {
      return c.json({ message: "User already exist" }, 409)
    }

    const data = await auth.api.signUpEmail({
      body: {
        email,
        name,
        password,
        role,
        phone,
        username: username,
      },
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
      asResponse: true,
    })
    // used kafka
    if (data.ok === true) {
      console.log(data)
      await producer.send("create.stripe", {
        value: JSON.stringify({ email }),
      })
    }
    return data
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

export const requestPasswordResetHandler: RouteHandler<
  typeof requestPasswordResetRoute
> = async (c) => {
  try {
    const { email } = c.req.valid("json")
    const validEmail = await db.select().from(user).where(eq(user.email, email))
    if (!validEmail.length) {
      return c.json({ message: "User not found", success: false }, 404)
    }
    const data = await auth.api.requestPasswordResetEmailOTP({
      body: {
        email,
      },
    })
    return c.json({
      data,
      message: "A verification OTP has been sent to your email",
    })
  } catch (error) {
    return c.json({ error })
  }
}

export const checkVerificationOtpHandler: RouteHandler<
  typeof checkVerificationOtpRoute
> = async (c) => {
  try {
    const { email, otp } = c.req.valid("json")
    return await auth.api.checkVerificationOTP({
      body: {
        email,
        type: "forget-password",
        otp,
      },
      asResponse: true,
    })
    // return c.json({ data })
  } catch (error) {
    return c.json({ error })
  }
}

export const resetPasswordHandler: RouteHandler<
  typeof resetPasswordRoute
> = async (c) => {
  const { email, otp, password } = c.req.valid("json")
  try {
    return await auth.api.resetPasswordEmailOTP({
      body: {
        email,
        otp,
        password,
      },
      asResponse: true,
    })
  } catch (error) {
    return c.json({ error })
  }
}

export const verifyEmailOtpHandler: RouteHandler<
  typeof verifyEmailOtpRoute
> = async (c) => {
  const { email } = c.req.valid("json")
  const data = await auth.api.sendVerificationOTP({
    body: {
      email,
      type: "email-verification",
    },
  })
  return c.json({ data })
}

export const updateUserHandler: RouteHandler<typeof updateUserRoute> = async (
  c
) => {
  const { name, image, phone, previousImage } = c.req.valid("form")

  try {
    let imageUrl: string | undefined | null = previousImage
    if (image) {
      const uploadedImages = await utapi.uploadFiles(image)
      imageUrl = uploadedImages.data?.ufsUrl
    } else if (!previousImage) {
      imageUrl = null
    }
    const data = await auth.api.updateUser({
      body: { name, image: imageUrl, phone },
      headers: c.req.raw.headers,
    })
    return c.json({ data })
  } catch (error) {
    return c.json({ error })
  }
}

export const setPasswordHandler: RouteHandler<typeof setPasswordRoute> = async (
  c
) => {
  const { newPassword, currentPassword, revokeOtherSessions } =
    c.req.valid("json")
  try {
    return await auth.api.changePassword({
      body: {
        newPassword,
        currentPassword,
        revokeOtherSessions,
      },
      headers: await c.req.raw.headers,
      asResponse: true,
    })
  } catch (error) {
    return c.json({ error })
  }
}

// set cookies
const COOKIE_SECRET = process.env.COOKIE_SECRET!
const JWT_SECRET = process.env.JWT_SECRET!
export const verifyPasswordHandler: RouteHandler<
  typeof verifyPasswordRoute
> = async (c) => {
  try {
    const { password } = c.req.valid("json")
    const token = c.get("session")?.token

    await auth.api.verifyPassword({
      body: {
        password,
      },
      headers: c.req.raw.headers,
    })

    // create hardcoded jwt token
    const jwtToken = await sign(
      {
        sub: token,
        exp: Math.floor(Date.now() / 1000) + 60 * 5, // 5 minutes
      },
      JWT_SECRET
    )

    // store jwt in signed cookie
    await setSignedCookie(
      c,
      "is_password_verified.access_token",
      jwtToken,
      COOKIE_SECRET,
      {
        httpOnly: true,
        secure: true,
        sameSite: "Lax",
        path: "/",
        maxAge: 60 * 5,
        // expires: new Date(Date.now() + 60 * 5 * 1000),
      }
    )

    return c.json({
      success: true,
    })
  } catch (error) {
    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      400
    )
  }
}

export const isPasswordVerifiedHandler: RouteHandler<
  typeof isPasswordVerifiedRoute
> = async (c) => {
  try {
    // verify signed cookie
    const token = await getSignedCookie(
      c,
      COOKIE_SECRET,
      "is_password_verified.access_token"
    )

    if (!token) {
      return c.json({ success: false }, 401)
    }

    // verify jwt
    const payload = await verify(token, JWT_SECRET, "HS256")

    if (payload) {
      return c.json(
        {
          success: true,
        },
        200
      )
    } else {
      return c.json({ success: false }, 400)
    }
  } catch (error) {
    return c.json(
      {
        success: false,
        error: "Invalid or expired token",
      },
      401
    )
  }
}

export const updateUsernameHandler: RouteHandler<
  typeof updateUsernameRoute
> = async (c) => {
  const { username } = c.req.valid("json")
  try {
    const data = await auth.api.updateUser({
      body: {
        username,
      },
      headers: c.req.raw.headers,
    })
    return c.json({ data }, 200)
  } catch (error) {
    return c.json({ error })
  }
}

export const userDetailsHandler: RouteHandler<typeof userDetailsRoute> = async (
  c
) => {
  const id = c.get("user")?.id
  if (!id) {
    return c.json({ data: undefined }, 404)
  }
  try {
    const data = await db.query.user.findFirst({ where: eq(user.id, id) })
    return c.json({ data }, 200)
  } catch (error) {
    return c.json({ error })
  }
}

export const getSendEmailHandler: RouteHandler<
  typeof getSendEmailRoute
> = async (c) => {
  const { email, otp, type } = c.req.valid("json")
  // used kafka
  await producer.send("verification.email", {
    value: JSON.stringify({ email, otp, type }),
  })
  return c.json({ success: true })
}
