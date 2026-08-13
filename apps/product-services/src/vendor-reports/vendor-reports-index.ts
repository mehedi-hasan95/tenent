import { OpenAPIHono, defaultHook } from "@workspace/open-api"
import {
  updateVendorSingleOrderRoute,
  vendorAllOrdersRoute,
  vendorCountryBasedRoute,
  vendorPreviousYearsReportRoute,
  vendorSingleOrderRoute,
  vendorTotalRevenueRoute,
} from "./vendor-reports-route"
import {
  updateVendorSingleOrderHandler,
  vendorAllOrdersHandler,
  vendorCountryBasedHandler,
  vendorPreviousYearsReportHandler,
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
  .openapi(vendorCountryBasedRoute, vendorCountryBasedHandler)
  .openapi(vendorPreviousYearsReportRoute, vendorPreviousYearsReportHandler)

export default app
