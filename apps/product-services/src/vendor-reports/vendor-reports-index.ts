import { OpenAPIHono, defaultHook } from "@workspace/open-api"
import {
  updateVendorSingleOrderRoute,
  vendorAllOrdersRoute,
  vendorCountryBasedRoute,
  vendorDailyReportRoute,
  vendorPopularProductsRoute,
  vendorPreviousYearsReportRoute,
  vendorProductsSaleRoute,
  vendorSingleOrderRoute,
  vendorTotalRevenueRoute,
} from "./vendor-reports-route"
import {
  updateVendorSingleOrderHandler,
  vendorAllOrdersHandler,
  vendorCountryBasedHandler,
  vendorDailyReportHandler,
  vendorPopularProductsHandler,
  vendorPreviousYearsReportHandler,
  vendorProductsSaleHandler,
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
  .openapi(vendorDailyReportRoute, vendorDailyReportHandler)
  .openapi(vendorPopularProductsRoute, vendorPopularProductsHandler)
  .openapi(vendorProductsSaleRoute, vendorProductsSaleHandler)

export default app
