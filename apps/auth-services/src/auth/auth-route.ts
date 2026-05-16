import { createRoute } from "@workspace/open-api"
import { registrationSchema } from "@workspace/validators/validators/user-validators"
import z from "zod"

const tags = ["Authintication"]

export const registrationRoute = createRoute({
  method: "post",
  path: "/registration",
  tags,
  summary: "Registration",
  request: {
    body: {
      content: {
        "application/json": {
          schema: registrationSchema,
        },
      },
    },
  },
  responses: {
    201: { description: "Created" },
    400: { description: "Bad Request" },
    500: { description: "Internal server error" },
  },
})

export const registrationEmailVerifyRoute = createRoute({
  method: "post",
  path: "/send-verification-otp",
  tags,
  summary: "Email verification OTP",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({ email: z.email() }),
        },
      },
    },
  },
  responses: {
    201: { description: "Created" },
    400: { description: "Bad Request" },
    404: { description: "Not Found" },
    500: { description: "Internal server error" },
  },
})
export const registrationEmailVerifyOTPRoute = createRoute({
  method: "post",
  path: "/verify-email",
  tags,
  summary: "Verify Email with OTP",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({ email: z.email(), otp: z.string() }),
        },
      },
    },
  },
  responses: {
    200: { description: "OK" },
    400: { description: "Bad Request" },
    404: { description: "Not Found" },
    500: { description: "Internal server error" },
  },
})
