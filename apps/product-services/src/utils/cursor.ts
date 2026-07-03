import { z } from "@hono/zod-openapi"

const cursorSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
})

export type Cursor = z.infer<typeof cursorSchema>

export const encodeCursor = (cursor: Cursor) =>
  Buffer.from(JSON.stringify(cursor)).toString("base64url")

export const decodeCursor = (value: string): Cursor | null => {
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf-8"))
    return cursorSchema.parse(parsed)
  } catch {
    return null
  }
}
