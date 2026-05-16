import { z } from "zod"

export const userRoleSchema = z.enum(["USER", "SELLER"])

const customError = "custom" as const

export const registrationSchema = z
  .object({
    name: z
      .string({ message: "Name is required!" })
      .min(2)
      .max(50)
      .openapi({ example: "Mehedi Hasan" }),

    email: z
      .email({ message: "Invalid email type" })
      .openapi({ example: "mehedi.jsx@gmail.com" }),
    username: z
      .string()
      .regex(
        /^[A-Za-z][A-Za-z0-9_]{2,14}$/,
        "Username must start with a letter and be 3-15 characters long"
      ),

    password: z
      .string()
      .min(6, { message: "Password will be atleast 6 characters" })
      .max(64, { message: "Password will be max 64 characters" })
      .openapi({ example: "123456" }),
    confirmPassword: z.string().openapi({ example: "123456" }),

    role: userRoleSchema.default("USER"),

    phone: z
      .string()
      .regex(/^\+?\d+$/, {
        message:
          "Phone number must contain only digits and an optional leading +",
      })
      .optional()
      .or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.role === "SELLER" && (!data.phone || data.phone.length < 6)) {
      ctx.addIssue({
        path: ["phone"],
        message: "Phone number is required for sellers",
        code: customError,
      })
    }
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Password do not match",
        code: customError,
      })
    }
  })
