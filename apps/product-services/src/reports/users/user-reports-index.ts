import { OpenAPIHono, defaultHook } from "@workspace/open-api"
import {
  addRatingRoute,
  getSingleOrderRoute,
  userAllOrdersRoute,
} from "./user-reports-route"
import {
  addRatingHandler,
  getSingleOrderHandler,
  userAllOrdersHandler,
} from "./user-reports-handler"

const app = new OpenAPIHono({
  defaultHook,
})

app
  .openapi(userAllOrdersRoute, userAllOrdersHandler)
  .openapi(getSingleOrderRoute, getSingleOrderHandler)
  .openapi(addRatingRoute, addRatingHandler)

export default app
