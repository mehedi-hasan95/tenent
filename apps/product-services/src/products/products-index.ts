import { OpenAPIHono, defaultHook } from "@workspace/open-api"
import {
  allProductsRoute,
  boostedProductRoute,
  singleProductsRoute,
} from "./products-route"
import {
  allProductsHandler,
  boostedProductHandler,
  singleProductsHandler,
} from "./products-handler"

const app = new OpenAPIHono({
  defaultHook,
})

app
  .openapi(allProductsRoute, allProductsHandler)
  .openapi(singleProductsRoute, singleProductsHandler)
  .openapi(boostedProductRoute, boostedProductHandler)

export default app
