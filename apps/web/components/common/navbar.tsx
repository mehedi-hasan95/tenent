"use client"
import { useGetSession } from "@/hooks/auth/use-auth"
import { LoginButton } from "../auth-components/login-button"
import { Logo } from "./logo"
import { LogginUserButton } from "./login-user-button"

export const NavBar = () => {
  const { user } = useGetSession()
  return (
    <div className="flex items-center justify-between gap-4">
      <Logo />
      {user?.id ? (
        <LogginUserButton user={user || null} />
      ) : (
        <LoginButton title="Sign In" />
      )}
    </div>
  )
}
