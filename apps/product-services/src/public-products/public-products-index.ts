import { OpenAPIHono, defaultHook } from "@workspace/open-api"
import {
  allProductsRoute,
  boostedProductRoute,
  getArrayProductsRoute,
  popularProductsRoute,
  ratingAndReviewRoute,
  singleProductsRoute,
} from "./public-products-route"
import {
  allProductsHandler,
  boostedProductHandler,
  getArrayProductsHandler,
  popularProductsHandler,
  ratingAndReviewHandler,
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
  .openapi(ratingAndReviewRoute, ratingAndReviewHandler)
  .openapi(getArrayProductsRoute, getArrayProductsHandler)

export default app
