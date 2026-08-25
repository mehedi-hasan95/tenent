import { OpenAPIHono, defaultHook } from "@workspace/open-api"
import {
  adminAllOrdersRoute,
  adminAllUsersRoute,
  adminCountRoute,
  adminCountryBasedRoute,
  adminDailyReportRoute,
  adminPopularProductsRoute,
  adminPreviousYearsReportRoute,
  adminSingleOrderRoute,
  adminTotalRevenueRoute,
} from "./admin-reports-route"
import {
  adminAllOrdersHandler,
  adminAllUsersHandler,
  adminCountHandler,
  adminCountryBasedHandler,
  adminDailyReportHandler,
  adminPopularProductsHandler,
  adminPreviousYearsReportHandler,
  adminSingleOrderHandler,
  adminTotalRevenueHandler,
} from "./admin-reports-handler"

const app = new OpenAPIHono({
  defaultHook,
})

app
  .openapi(adminTotalRevenueRoute, adminTotalRevenueHandler)
  .openapi(adminAllOrdersRoute, adminAllOrdersHandler)
  .openapi(adminSingleOrderRoute, adminSingleOrderHandler)
  .openapi(adminCountryBasedRoute, adminCountryBasedHandler)
  .openapi(adminPreviousYearsReportRoute, adminPreviousYearsReportHandler)
  .openapi(adminDailyReportRoute, adminDailyReportHandler)
  .openapi(adminPopularProductsRoute, adminPopularProductsHandler)
  .openapi(adminAllUsersRoute, adminAllUsersHandler)
  .openapi(adminCountRoute, adminCountHandler)

export default app
