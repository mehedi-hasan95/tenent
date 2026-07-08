import { defaultHook, OpenAPIHono } from "@workspace/open-api"
import {
  allBoostingCoinRoute,
  createBoostingCoinRoute,
  setActiveBoostingCoinRoute,
} from "./boosting-coin-route"
import {
  allBoostingCoinHandler,
  createBoostingCoinHandler,
  setActiveBoostingCoinHandler,
} from "./boosting-coin-handler"

const app = new OpenAPIHono({
  defaultHook,
})

app
  .openapi(createBoostingCoinRoute, createBoostingCoinHandler)
  .openapi(setActiveBoostingCoinRoute, setActiveBoostingCoinHandler)
  .openapi(allBoostingCoinRoute, allBoostingCoinHandler)

export default app
