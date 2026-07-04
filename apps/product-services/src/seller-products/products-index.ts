import { OpenAPIHono, defaultHook } from "@workspace/open-api"
import {
  allTrashedProductsRoute,
  createProductRoute,
  deleteManyProductsRoute,
  deleteTrashedProductsRoute,
  restoreProductsRoute,
  trashedProductRoute,
  updateProductRoute,
} from "./products-route"
import {
  allTrashedProductsHandler,
  createProductHandler,
  deleteManyProductsHandler,
  deleteTrashedProductsHandler,
  restoreProductsHandler,
  trashedProductHandler,
  updateProductHandler,
} from "./products-handler"

const app = new OpenAPIHono({
  defaultHook,
})

app
  .openapi(createProductRoute, createProductHandler)
  .openapi(updateProductRoute, updateProductHandler)
  .openapi(trashedProductRoute, trashedProductHandler)
  .openapi(allTrashedProductsRoute, allTrashedProductsHandler)
  .openapi(restoreProductsRoute, restoreProductsHandler)
  .openapi(deleteManyProductsRoute, deleteManyProductsHandler)
  .openapi(deleteTrashedProductsRoute, deleteTrashedProductsHandler)

export default app
