"use server"

import { sessionType } from "@workspace/validators/types/auth.types"
import { headers } from "next/headers"

export const getSessionAction = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/get-session`,
    {
      method: "GET",
      headers: {
        cookie: (await headers()).get("cookie") ?? "",
      },
    }
  )
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  const data: { data: sessionType } = await response.json()
  return data.data
}

export const signoutAction = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/sign-out`,
    {
      method: "POST",
      headers: {
        cookie: (await headers()).get("cookie") ?? "",
      },

      credentials: "include",
    }
  )
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  return response.json()
}
