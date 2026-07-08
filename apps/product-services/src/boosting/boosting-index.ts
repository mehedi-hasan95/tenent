import { OpenAPIHono, defaultHook } from "@workspace/open-api"
import { getActiveBoostingCoinRoute } from "./boosting-route"
import { getActiveBoostingCoinHandler } from "./boosting-handler"

const app = new OpenAPIHono({
  defaultHook,
})

app.openapi(getActiveBoostingCoinRoute, getActiveBoostingCoinHandler)

export default app
