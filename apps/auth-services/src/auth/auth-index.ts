import { defaultHook, OpenAPIHono } from "@workspace/open-api"
import { registrationRoute } from "./auth-route"
import { registrationHandler } from "./auth-handler"

const app = new OpenAPIHono({
  defaultHook,
})

app.openapi(registrationRoute, registrationHandler)

export default app
