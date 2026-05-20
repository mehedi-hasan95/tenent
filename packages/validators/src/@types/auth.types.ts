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
