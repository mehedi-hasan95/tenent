import { RouteHandler } from "@workspace/open-api"
import { registrationRoute } from "./auth-route"
import { auth } from "@workspace/auth"

export const registrationHandler: RouteHandler<
  typeof registrationRoute
> = async (c) => {
  const { email, name, password } = c.req.valid("json")
  try {
    const data = await auth.api.signUpEmail({ body: { email, name, password } })
    return c.json({ data }, 201)
  } catch (error) {
    return c.json({ error })
  }
}
