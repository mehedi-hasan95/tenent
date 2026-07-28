import { OpenAPIHono, defaultHook } from "@workspace/open-api"
import {
  getActiveBoostingCoinRoute,
  getAllBoostedProductsRoute,
  productBoostingRoute,
  vendorCoinPurchaseHistoryRoute,
  vendorCoinsRoute,
} from "./boosting-route"
import {
  getActiveBoostingCoinHandler,
  getAllBoostedProductsHandler,
  productBoostingHandler,
  vendorCoinPurchaseHistoryHandler,
  vendorCoinsHandler,
} from "./boosting-handler"

const app = new OpenAPIHono({
  defaultHook,
})

app
  .openapi(getActiveBoostingCoinRoute, getActiveBoostingCoinHandler)
  .openapi(vendorCoinsRoute, vendorCoinsHandler)
  .openapi(vendorCoinPurchaseHistoryRoute, vendorCoinPurchaseHistoryHandler)
  .openapi(productBoostingRoute, productBoostingHandler)
  .openapi(getAllBoostedProductsRoute, getAllBoostedProductsHandler)

export default app
