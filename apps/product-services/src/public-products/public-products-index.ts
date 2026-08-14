import { OpenAPIHono, defaultHook } from "@workspace/open-api"
import {
  allProductsRoute,
  boostedProductRoute,
  popularProductsRoute,
  singleProductsRoute,
} from "./public-products-route"
import {
  allProductsHandler,
  boostedProductHandler,
  popularProductsHandler,
  singleProductsHandler,
} from "./public-products-handler"

const app = new OpenAPIHono({
  defaultHook,
})

app
  .openapi(allProductsRoute, allProductsHandler)
  .openapi(singleProductsRoute, singleProductsHandler)
  .openapi(boostedProductRoute, boostedProductHandler)
  .openapi(popularProductsRoute, popularProductsHandler)

export default app
