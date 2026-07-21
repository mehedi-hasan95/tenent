import { defaultHook, OpenAPIHono } from "@workspace/open-api"
import {
  retrieveStripeConnectRoute,
  stripeConnectRoute,
  stripeWebhookRoute,
} from "./stripe-route"
import {
  retrieveStripeConnectHandler,
  stripeConnectHandler,
  stripeWebhookHandler,
} from "./stripe-handler"

const app = new OpenAPIHono({
  defaultHook,
})

app
  .openapi(stripeWebhookRoute, stripeWebhookHandler)
  .openapi(stripeConnectRoute, stripeConnectHandler)
  .openapi(retrieveStripeConnectRoute, retrieveStripeConnectHandler)

export default app
