import { defaultHook, OpenAPIHono } from "@workspace/open-api"
import { createOrderRoute } from "./orders-route"
import { createOrderHandler } from "./orders-handler"

const app = new OpenAPIHono({
  defaultHook,
})

app.openapi(createOrderRoute, createOrderHandler)

export default app
