import { OpenAPIHono, defaultHook } from "@workspace/open-api"
import { userAllOrdersRoute } from "./user-reports-route"
import { userAllOrdersHandler } from "./user-reports-handler"

const app = new OpenAPIHono({
  defaultHook,
})

app.openapi(userAllOrdersRoute, userAllOrdersHandler)

export default app
