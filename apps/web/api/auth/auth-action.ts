import { getUserType } from "@workspace/validators/types/auth.types"
import {
  loginSchema,
  registrationSchema,
  resetPasswordSchema,
  updatePasswordValidator,
  updateUsernameValidator,
  updateUserSchema,
} from "@workspace/validators/validators/user-validators"
import z from "zod"

export const registrationAction = async (
  data: z.input<typeof registrationSchema>
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/registration`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  )
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  const result = await response.json()
  return result
}

export const registrationOtpAction = async (data: { email: string }) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/send-verification-otp`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  )
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  const result = await response.json()
  return result
}

export const verifyRegistrationOtpAction = async (data: {
  email: string
  otp: string
}) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/verify-email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    }
  )
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  const result = await response.json()
  return result
}

export const loginAction = async (data: z.input<typeof loginSchema>) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    }
  )
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  return response.json()
}

export const resetPasswordEmailAction = async (data: { email: string }) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/request-password-reset`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  )
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  return response.json()
}

export const resetPasswordOtpAction = async (data: {
  email: string
  otp: string
}) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/check-verification-otp`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  )
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  return response.json()
}

export const resetPasswordAction = async (
  data: z.infer<typeof resetPasswordSchema>
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/reset-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  )
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  return response.json()
}

export const updateUserAction = async (
  data: z.input<typeof updateUserSchema>
) => {
  const formData = new FormData()
  const { name, phone, image, previousImage } = data

  Object.entries({ name, phone, previousImage }).forEach(
    ([k, v]) => v && formData.append(k, v)
  )
  if (image instanceof File) formData.append("image", image)
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/update-user`,
    {
      method: "POST",
      credentials: "include",
      body: formData,
    }
  )
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  return response.json()
}

export const verifyPasswordAction = async (data: { password: string }) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/verify-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    }
  )

  const result = await response.json()

  if (!response.ok) {
    throw result
  }

  return result
}

export const isPasswordVerifiedAction = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/is-password-verified`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  )

  const result = await response.json()

  if (!response.ok) {
    throw result
  }

  return result
}

// update password
export const updatePasswordAction = async (
  data: z.input<typeof updatePasswordValidator>
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/set-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    }
  )
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  return response.json()
}

export const updateUsernameAction = async (
  data: z.input<typeof updateUsernameValidator>
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/update-username`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    }
  )
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  return response.json()
}

export const getUserAction = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/get-user`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  )
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  const data: { data: getUserType | undefined } = await response.json()
  return data.data
}
