import { LoginButton } from "@/components/auth/login-button"
import { Logo } from "../logo"

export const NavBar = () => {
  return (
    <div className="flex items-center justify-between">
      <Logo />
      <LoginButton />
    </div>
  )
}
