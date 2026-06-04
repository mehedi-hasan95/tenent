import { LoginButton } from "@/components/auth/login-button"
import { Logo } from "../logo"
import { useGetSession } from "@/hooks/auth/use-auth"
import { ProfileButton } from "./profile-button"

export const NavBar = () => {
  const { user } = useGetSession()
  return (
    <div className="flex items-center justify-between">
      <Logo />
      {user?.id ? <ProfileButton user={user} /> : <LoginButton />}
    </div>
  )
}
