import { defaultHook, OpenAPIHono } from "@workspace/open-api"
import { buyCoinRoute } from "./boosting-stripe-route"
import { buyCoinHandler } from "./boosting-stripe-handler"

const app = new OpenAPIHono({
  defaultHook,
})

app.openapi(buyCoinRoute, buyCoinHandler)

export default app
