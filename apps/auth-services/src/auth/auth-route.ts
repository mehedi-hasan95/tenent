import { createRoute } from "@workspace/open-api"
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
          schema: z.object({
            email: z.email(),
            name: z.string(),
            password: z.string(),
          }),
        },
      },
    },
  },
  responses: { 201: { description: "Created" } },
})
