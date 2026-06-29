import { createRoute } from "@workspace/open-api"
import { adminMiddleware } from "../middleware"

const tags = ["User"]
export const getAllUserRoute = createRoute({
  method: "get",
  path: "/all-user",
  tags,
  middleware: adminMiddleware,
  summary: "Get all user only for admin",
  responses: {
    200: { description: "OK" },
    403: { description: "UNAUTHORIZED" },
    500: { description: "INTERNAL_SERVER_ERROR" },
  },
})
