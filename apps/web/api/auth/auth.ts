import {
  loginSchema,
  registrationSchema,
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
