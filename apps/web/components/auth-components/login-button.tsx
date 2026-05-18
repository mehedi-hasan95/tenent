"use client"

import { useAuthModal } from "@/store/useAuthModalStore"
import { Button } from "@workspace/ui/components/button"

interface Props {
  title?: string
}
export const LoginButton = ({ title = "Sign In" }: Props) => {
  const { openLogin } = useAuthModal()
  return (
    <Button variant={"outline"} onClick={() => openLogin()}>
      {title}
    </Button>
  )
}
