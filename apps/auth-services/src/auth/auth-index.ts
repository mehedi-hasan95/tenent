import { defaultHook, OpenAPIHono } from "@workspace/open-api"
import {
  loginRoute,
  registrationEmailVerifyOTPRoute,
  registrationEmailVerifyRoute,
  registrationRoute,
  signOutRoute,
} from "./auth-route"
import {
  loginHandler,
  registrationEmailVerifyHandler,
  registrationEmailVerifyOTPHandler,
  registrationHandler,
  signOutHandler,
} from "./auth-handler"

const app = new OpenAPIHono({
  defaultHook,
})

app
  .openapi(registrationRoute, registrationHandler)
  .openapi(registrationEmailVerifyRoute, registrationEmailVerifyHandler)
  .openapi(registrationEmailVerifyOTPRoute, registrationEmailVerifyOTPHandler)
  .openapi(loginRoute, loginHandler)
  .openapi(signOutRoute, signOutHandler)

export default app
