import "dotenv/config"

import { serve } from "@hono/node-server"
import { Hono } from "hono"
import {
  defaultHook,
  openAPIConfiguration,
  OpenAPIHono,
} from "@workspace/open-api"
import { cors } from "hono/cors"
import { HTTPException } from "hono/http-exception"
import auth from "./auth/auth-index"

const app = new OpenAPIHono({
  defaultHook,
}).basePath("/api/v1")
app.use(
  cors({
    origin: ["http://localhost:3000"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
)

/**
 * ============================================================
 * 📌 RPC: Here start the RPC
 * ============================================================
 */
const routes = app.route("/auth", auth)

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse()
  }

  console.error("Unhandled error:", err)

  return c.json(
    {
      success: false,
      message: "Internal server error",
    },
    500
  )
})
serve(
  {
    fetch: app.fetch,
    port: 4001,
  },
  (info) => {
    ;(console.log(`Server is running on http://localhost:${info.port}`),
      console.log(
        `You can get the documentation at http://localhost:${info.port}/api/v1/tenent`
      ))
  }
)

openAPIConfiguration(app)
export default app
export type AppType = typeof routes
