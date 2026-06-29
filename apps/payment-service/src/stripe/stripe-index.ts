import { defaultHook, OpenAPIHono } from "@workspace/open-api"
import { stripeConnectRoute, stripeWebhookRoute } from "./stripe-route"
import { stripeConnectHandler, stripeWebhookHandler } from "./stripe-handler"

const app = new OpenAPIHono({
  defaultHook,
})

app
  .openapi(stripeWebhookRoute, stripeWebhookHandler)
  .openapi(stripeConnectRoute, stripeConnectHandler)

export default app
