import { z, ZodType } from "zod"

/**
 * Normalizes multipart/form-data array fields.
 * Handles three shapes a single field can arrive in:
 *  - undefined (not sent)
 *  - a single string (only one value appended)
 *  - a string[] (multiple values appended)
 */
export const formArray = <T extends ZodType>(schema: T) =>
  z.preprocess((val) => {
    if (val === undefined || val === null || val === "") return undefined
    return Array.isArray(val) ? val : [val]
  }, schema)

/**
 * Normalizes a JSON-stringified array field (e.g. objects sent via
 * fd.append(key, JSON.stringify(value))).
 */
export const jsonArray = <T extends ZodType>(schema: T) =>
  z.preprocess((val) => {
    if (typeof val !== "string") return val
    try {
      return JSON.parse(val)
    } catch {
      return val
    }
  }, schema)
