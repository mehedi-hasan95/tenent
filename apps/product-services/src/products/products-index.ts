import { OpenAPIHono, defaultHook } from "@workspace/open-api"
import { createProductRoute } from "./products-route"
import { createProductHandler } from "./products-handler"

const app = new OpenAPIHono({
  defaultHook,
})

app.openapi(createProductRoute, createProductHandler)

export default app
