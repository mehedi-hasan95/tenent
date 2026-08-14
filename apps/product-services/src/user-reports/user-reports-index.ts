import { OpenAPIHono, defaultHook } from "@workspace/open-api"
import {
  addRatingRoute,
  getAllRatingsRoute,
  getSingleOrderRoute,
  userAllOrdersRoute,
} from "./user-reports-route"
import {
  addRatingHandler,
  getAllRatingsHandler,
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
  .openapi(getAllRatingsRoute, getAllRatingsHandler)

export default app
