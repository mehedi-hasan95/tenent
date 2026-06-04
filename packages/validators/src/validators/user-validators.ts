import { z } from "zod"

export const userRoleSchema = z.enum(["USER", "SELLER"])

const customError = "custom" as const

export const registrationSchema = z
  .object({
    name: z.string({ message: "Name is required!" }).min(2).max(50),

    email: z.email({ message: "Invalid email type" }),
    username: z
      .string()
      .regex(
        /^[A-Za-z][A-Za-z0-9_]{2,14}$/,
        "Username must start with a letter and be 3-15 characters long"
      ),

    password: z
      .string()
      .min(6, { message: "Password will be atleast 6 characters" })
      .max(64, { message: "Password will be max 64 characters" }),
    confirmPassword: z.string(),

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

export const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
  rememberMe: z.boolean(),
})

export const resetPasswordSchema = z.object({
  email: z.email(),
  otp: z.string(),
  password: z.string().min(6).max(64),
})

export const updateUserSchema = z
  .object({
    name: z.string({ message: "Name is required!" }).min(2).max(50),
    image: z
      .instanceof(File)
      .refine((file) => file.type.startsWith("image/"), {
        message: "Only image files are allowed",
      })
      .refine((file) => file.size <= 2 * 1024 * 1024, {
        message: "Image size must be less than 2MB",
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
  .refine((data) => !(data.image && data.previousImage), {
    message: "Remove the previous image before uploading a new one",
    path: ["previousImage"],
  })
  .refine(
    (data) => {
      return !!(data.name || data.image || data.phone || data.previousImage)
    },
    {
      message: "At least one field is required",
      path: ["name"],
    }
  )

export const updatePasswordValidator = z
  .object({
    newPassword: z.string().min(6).max(64),
    confirmPassword: z.string().min(6).max(64),
    currentPassword: z.string(),
    revokeOtherSessions: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Password do not match",
        code: customError,
      })
    }
  })

export const updateUsernameValidator = z.object({
  username: z.string().min(3).max(64),
})
