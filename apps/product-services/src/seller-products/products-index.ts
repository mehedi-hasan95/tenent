import { OpenAPIHono, defaultHook } from "@workspace/open-api"
import {
  allTrashedProductsRoute,
  createCouponRoute,
  createProductRoute,
  deleteATrashedProductRoute,
  deleteManyProductsRoute,
  deleteTrashedProductsRoute,
  getACouponRoute,
  getAllCouponRoute,
  restoreProductsRoute,
  sellerAllProductRoute,
  trashedProductRoute,
  updateCouponRoute,
  updateProductRoute,
} from "./products-route"
import {
  allTrashedProductsHandler,
  createCouponHandler,
  createProductHandler,
  deleteATrashedProductHandler,
  deleteManyProductsHandler,
  deleteTrashedProductsHandler,
  getACouponHandler,
  getAllCouponHandler,
  restoreProductsHandler,
  sellerAllProductHandler,
  trashedProductHandler,
  updateCouponHandler,
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
  .openapi(createCouponRoute, createCouponHandler)
  .openapi(updateCouponRoute, updateCouponHandler)
  .openapi(getACouponRoute, getACouponHandler)
  .openapi(getAllCouponRoute, getAllCouponHandler)

export default app
