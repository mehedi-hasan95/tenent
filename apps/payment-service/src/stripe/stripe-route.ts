import { createRoute } from "@workspace/open-api"
import { authMiddleware } from "../middleware"

const tags = ["Stripe"]
export const stripeWebhookRoute = createRoute({
  method: "post",
  path: "/webhooks",
  summary: "Stripe Webhook",
  description: "Receives and processes Stripe webhook events",
  tags,
  responses: {
    200: {
      description: "Webhook received successfully",
    },
    400: {
      description: "Invalid signature or bad request",
    },
  },
})

export const stripeConnectRoute = createRoute({
  method: "get",
  path: "/connect",
  summary: "Stripe Connect",
  description: "Create Stripe Connect account & get onboarding link",
  tags,
  middleware: authMiddleware,
  responses: {
    200: { description: "Onboarding link created" },
    400: { description: "Bad request" },
    401: { description: "Unauthorize" },
    404: { description: "Stripe ID not found" },
  },
})
