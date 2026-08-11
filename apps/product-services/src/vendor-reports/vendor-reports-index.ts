import { OpenAPIHono, defaultHook } from "@workspace/open-api"
import { vendorTotalRevenueRoute } from "./vendor-reports-route"
import { vendorTotalRevenueHandler } from "./vendor-reports-handler"

const app = new OpenAPIHono({
  defaultHook,
})

app.openapi(vendorTotalRevenueRoute, vendorTotalRevenueHandler)

export default app
