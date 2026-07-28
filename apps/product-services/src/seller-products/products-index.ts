import { OpenAPIHono, defaultHook } from "@workspace/open-api"
import {
  allTrashedProductsRoute,
  createProductRoute,
  deleteATrashedProductRoute,
  deleteManyProductsRoute,
  deleteTrashedProductsRoute,
  restoreProductsRoute,
  sellerAllProductRoute,
  trashedProductRoute,
  updateProductRoute,
} from "./products-route"
import {
  allTrashedProductsHandler,
  createProductHandler,
  deleteATrashedProductHandler,
  deleteManyProductsHandler,
  deleteTrashedProductsHandler,
  restoreProductsHandler,
  sellerAllProductHandler,
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
  .openapi(deleteATrashedProductRoute, deleteATrashedProductHandler)
  .openapi(sellerAllProductRoute, sellerAllProductHandler)

export default app
