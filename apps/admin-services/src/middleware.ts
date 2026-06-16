import { auth } from "@workspace/auth"
import { createMiddleware } from "hono/factory"

type Env = {
  Variables: {
    user: typeof auth.$Infer.Session.user | null
    session: typeof auth.$Infer.Session.session | null
  }
}

export const authMiddleware = createMiddleware<Env>(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers })
  if (!session) {
    c.set("user", null)
    c.set("session", null)
    return c.json({ message: "Unauthorize" }, 401)
  }

  c.set("user", session.user)
  c.set("session", session.session)
  await next()
})

export const adminMiddleware = createMiddleware<Env>(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers })
  if (!session || session.user.role !== "ADMIN") {
    c.set("user", null)
    c.set("session", null)
    return c.json({ message: "Only admin has the access" }, 401)
  }

  c.set("user", session.user)
  c.set("session", session.session)
  await next()
})

export const sellerMiddleware = createMiddleware<Env>(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers })
  if (!session || session.user.role !== "SELLER") {
    c.set("user", null)
    c.set("session", null)
    return c.json({ message: "Only admin has the access" }, 401)
  }

  c.set("user", session.user)
  c.set("session", session.session)
  await next()
})
