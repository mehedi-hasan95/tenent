import { OpenAPIHono, defaultHook } from "@workspace/open-api"
import {
  updateVendorSingleOrderRoute,
  vendorAllOrdersRoute,
  vendorSingleOrderRoute,
  vendorTotalRevenueRoute,
} from "./vendor-reports-route"
import {
  updateVendorSingleOrderHandler,
  vendorAllOrdersHandler,
  vendorSingleOrderHandler,
  vendorTotalRevenueHandler,
} from "./vendor-reports-handler"

const app = new OpenAPIHono({
  defaultHook,
})

app
  .openapi(vendorTotalRevenueRoute, vendorTotalRevenueHandler)
  .openapi(vendorAllOrdersRoute, vendorAllOrdersHandler)
  .openapi(vendorSingleOrderRoute, vendorSingleOrderHandler)
  .openapi(updateVendorSingleOrderRoute, updateVendorSingleOrderHandler)

export default app
