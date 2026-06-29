import { defaultHook, OpenAPIHono } from "@workspace/open-api"
import {
  checkVerificationOtpRoute,
  getSendEmailRoute,
  isPasswordVerifiedRoute,
  loginRoute,
  registrationEmailVerifyOTPRoute,
  registrationRoute,
  requestPasswordResetRoute,
  resetPasswordRoute,
  sessionRoute,
  setPasswordRoute,
  signOutRoute,
  updateUsernameRoute,
  updateUserRoute,
  userDetailsRoute,
  verifyEmailOtpRoute,
  verifyPasswordRoute,
} from "./auth-route"
import {
  checkVerificationOtpHandler,
  loginHandler,
  registrationEmailVerifyOTPHandler,
  registrationHandler,
  requestPasswordResetHandler,
  sessionHandler,
  signOutHandler,
  resetPasswordHandler,
  verifyEmailOtpHandler,
  verifyPasswordHandler,
  updateUserHandler,
  setPasswordHandler,
  isPasswordVerifiedHandler,
  updateUsernameHandler,
  userDetailsHandler,
  getSendEmailHandler,
} from "./auth-handler"

const app = new OpenAPIHono({
  defaultHook,
})

app
  .openapi(registrationRoute, registrationHandler)
  .openapi(verifyEmailOtpRoute, verifyEmailOtpHandler)
  .openapi(registrationEmailVerifyOTPRoute, registrationEmailVerifyOTPHandler)
  .openapi(loginRoute, loginHandler)
  .openapi(signOutRoute, signOutHandler)
  .openapi(sessionRoute, sessionHandler)
  .openapi(requestPasswordResetRoute, requestPasswordResetHandler)
  .openapi(checkVerificationOtpRoute, checkVerificationOtpHandler)
  .openapi(resetPasswordRoute, resetPasswordHandler)
  .openapi(verifyPasswordRoute, verifyPasswordHandler)
  .openapi(updateUserRoute, updateUserHandler)
  .openapi(setPasswordRoute, setPasswordHandler)
  .openapi(isPasswordVerifiedRoute, isPasswordVerifiedHandler)
  .openapi(updateUsernameRoute, updateUsernameHandler)
  .openapi(userDetailsRoute, userDetailsHandler)
  .openapi(getSendEmailRoute, getSendEmailHandler)

export default app
