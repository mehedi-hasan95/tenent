import { defaultHook, OpenAPIHono } from "@workspace/open-api"
import { getAllUserRoute } from "./users-route"
import { getAllUserHandler } from "./users-handler"

const app = new OpenAPIHono({
  defaultHook,
})

app.openapi(getAllUserRoute, getAllUserHandler)

export default app
