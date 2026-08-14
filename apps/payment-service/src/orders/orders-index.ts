import { defaultHook, OpenAPIHono } from "@workspace/open-api"
import { createOrderRoute, retrieveOrderRoute } from "./orders-route"
import { createOrderHandler, retrieveOrderHandler } from "./orders-handler"

const app = new OpenAPIHono({
  defaultHook,
})

app
  .openapi(createOrderRoute, createOrderHandler)
  .openapi(retrieveOrderRoute, retrieveOrderHandler)

export default app
