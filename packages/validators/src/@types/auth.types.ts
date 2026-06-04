export type userSessionType = {
  id: string
  email: string
  name: string
  image: string | null
  role: "USER" | "SELLER" | "ADMIN" // adjust if more roles exist
  stripeVerified: boolean
}
export type sessionType = {
  user: userSessionType
  session: { token: string }
}

export type getUserType = {
  username: string | null
  id: string
  name: string
  email: string
  emailVerified: boolean
  image: string | null
  createdAt: Date
  updatedAt: Date
  displayUsername: string | null
  role: "USER" | "SELLER" | "ADMIN" | null
  phone: string | null
  stripeVerified: boolean | null
}
