import { LoginButton } from "../auth-components/login-button"
import { Logo } from "./logo"

export const NavBar = () => {
  return (
    <div className="flex items-center justify-between gap-4">
      <Logo />
      <LoginButton title="Sign In" />
    </div>
  )
}
