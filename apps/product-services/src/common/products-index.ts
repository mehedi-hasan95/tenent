import { OpenAPIHono, defaultHook } from "@workspace/open-api"
import { allProductsRoute, singleProductsRoute } from "./products-route"
import { allProductsHandler, singleProductsHandler } from "./products-handler"

const app = new OpenAPIHono({
  defaultHook,
})

app
  .openapi(allProductsRoute, allProductsHandler)
  .openapi(singleProductsRoute, singleProductsHandler)

export default app
