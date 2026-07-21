import { OpenAPIHono, defaultHook } from "@workspace/open-api"
import {
  getActiveBoostingCoinRoute,
  vendorCoinPurchaseHistoryRoute,
  vendorCoinsRoute,
} from "./boosting-route"
import {
  getActiveBoostingCoinHandler,
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

export default app
