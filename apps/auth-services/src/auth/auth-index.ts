import { defaultHook, OpenAPIHono } from "@workspace/open-api"
import {
  registrationEmailVerifyOTPRoute,
  registrationEmailVerifyRoute,
  registrationRoute,
} from "./auth-route"
import {
  registrationEmailVerifyHandler,
  registrationEmailVerifyOTPHandler,
  registrationHandler,
} from "./auth-handler"

const app = new OpenAPIHono({
  defaultHook,
})

app
  .openapi(registrationRoute, registrationHandler)
  .openapi(registrationEmailVerifyRoute, registrationEmailVerifyHandler)
  .openapi(registrationEmailVerifyOTPRoute, registrationEmailVerifyOTPHandler)

export default app
