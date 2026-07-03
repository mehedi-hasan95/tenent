import { OpenAPIHono, defaultHook } from "@workspace/open-api"
import { allProductsRoute } from "./products-route"
import { allProductsHandler } from "./products-handler"

const app = new OpenAPIHono({
  defaultHook,
})

app.openapi(allProductsRoute, allProductsHandler)

export default app
