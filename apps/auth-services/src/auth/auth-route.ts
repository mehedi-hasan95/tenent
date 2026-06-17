import { createRoute } from "@workspace/open-api"
import {
  loginSchema,
  registrationSchema,
  resetPasswordSchema,
  updatePasswordValidator,
  updateUsernameValidator,
} from "@workspace/validators/validators/user-validators"
import z from "zod"
import { authMiddleware } from "../middleware"

const tags = ["Authentication"]

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

export const verifyEmailOtpRoute = createRoute({
  method: "post",
  path: "/send-verification-otp",
  tags,
  summary: "Email verification",
  request: {
    body: {
      content: {
        "application/json": { schema: z.object({ email: z.email() }) },
      },
    },
  },
  responses: {
    201: { description: "OK" },
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

export const loginRoute = createRoute({
  method: "post",
  path: "/login",
  tags,
  summary: "Sign In",
  request: {
    body: {
      content: {
        "application/json": {
          schema: loginSchema,
        },
      },
    },
  },
  responses: {
    201: { description: "OK" },
    400: { description: "Bad Request" },
    404: { description: "Not Found" },
    500: { description: "Internal server error" },
  },
})

export const signOutRoute = createRoute({
  method: "post",
  path: "/sign-out",
  tags,
  summary: "Sign Out",
  responses: {
    201: { description: "OK" },
    400: { description: "Bad Request" },
    404: { description: "Not Found" },
    500: { description: "Internal server error" },
  },
})

export const sessionRoute = createRoute({
  method: "get",
  path: "/get-session",
  tags,
  summary: "Get Session",
  responses: {
    200: { description: "OK" },
    500: { description: "Internal server error" },
  },
})

export const requestPasswordResetRoute = createRoute({
  method: "post",
  path: "request-password-reset",
  tags,
  summary: "Reset Password Email",
  request: {
    body: {
      content: {
        "application/json": { schema: z.object({ email: z.email() }) },
      },
    },
  },
  responses: {
    201: { description: "OK" },
    400: { description: "Bad Request" },
    404: { description: "Not Found" },
    500: { description: "Internal server error" },
  },
})

export const checkVerificationOtpRoute = createRoute({
  method: "post",
  path: "/check-verification-otp",
  tags,
  summary: "Reset Password OTP",
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
    201: { description: "OK" },
    400: { description: "Bad Request" },
    404: { description: "Not Found" },
    500: { description: "Internal server error" },
  },
})

export const resetPasswordRoute = createRoute({
  method: "post",
  path: "/reset-password",
  tags,
  summary: "Reset Password",
  request: {
    body: {
      content: {
        "application/json": {
          schema: resetPasswordSchema,
        },
      },
    },
  },
  responses: {
    201: { description: "OK" },
    400: { description: "Bad Request" },
    404: { description: "Not Found" },
    500: { description: "Internal server error" },
  },
})

export const verifyPasswordRoute = createRoute({
  method: "post",
  path: "/verify-password",
  tags,
  summary: "Verify Password",
  middleware: authMiddleware,
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({ password: z.string() }),
        },
      },
    },
  },
  responses: {
    201: { description: "OK" },
    400: { description: "Bad Request" },
    404: { description: "Not Found" },
    500: { description: "Internal server error" },
  },
})

export const updateUserRoute = createRoute({
  method: "post",
  path: "/update-user",
  tags,
  summary: "Update User Information",
  middleware: authMiddleware,
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: z
            .object({
              name: z.string().optional(),
              image: z
                .any()
                .openapi({
                  type: "string",
                  format: "binary",
                })
                .optional(),
              previousImage: z.string().optional(),
              phone: z
                .string()
                .regex(/^\+?\d+$/, {
                  message:
                    "Phone number must contain only digits and an optional leading +",
                })
                .optional()
                .or(z.literal("")),
            })
            .refine(
              (data) => {
                return !!(
                  data.name ||
                  data.image ||
                  data.phone ||
                  data.previousImage
                )
              },
              {
                message: "At least one field is required",
                path: ["name"],
              }
            ),
        },
      },
    },
  },
  responses: {
    201: { description: "OK" },
    400: { description: "Bad Request" },
    404: { description: "Not Found" },
    500: { description: "Internal server error" },
  },
})

export const setPasswordRoute = createRoute({
  method: "post",
  path: "/set-password",
  tags,
  summary: "Update Password",
  middleware: authMiddleware,
  request: {
    body: {
      content: {
        "application/json": {
          schema: updatePasswordValidator,
        },
      },
    },
  },
  responses: {
    201: { description: "OK" },
    400: { description: "Bad Request" },
    404: { description: "Not Found" },
    500: { description: "Internal server error" },
  },
})

export const isPasswordVerifiedRoute = createRoute({
  method: "get",
  path: "/is-password-verified",
  tags,
  summary: "Is Password verified",

  responses: {
    200: { description: "OK" },
    400: { description: "Bad Request" },
    404: { description: "Not Found" },
    500: { description: "Internal server error" },
  },
})

export const updateUsernameRoute = createRoute({
  method: "post",
  path: "/update-username",
  tags,
  summary: "Update username",
  middleware: authMiddleware,
  request: {
    body: {
      content: { "application/json": { schema: updateUsernameValidator } },
    },
  },
  responses: {
    200: { description: "OK" },
    400: { description: "Bad Request" },
    404: { description: "Not Found" },
    500: { description: "Internal server error" },
  },
})

export const userDetailsRoute = createRoute({
  method: "get",
  path: "/get-user",
  tags,
  summary: "Get User Details",
  middleware: authMiddleware,
  responses: {
    200: { description: "OK" },
    400: { description: "Bad Request" },
    404: { description: "Not Found" },
    500: { description: "Internal server error" },
  },
})
