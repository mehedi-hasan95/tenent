"use client"

import { useAuthModal } from "@/store/useAuthModalStore"
import { AuthModal } from "./auth-modal"
import { SignInForm } from "./signin-form"

export const SignInModal = () => {
  const { isLoginOpen, closeLogin } = useAuthModal()
  return (
    <AuthModal onClose={closeLogin} isOpen={isLoginOpen}>
      <SignInForm />
    </AuthModal>
  )
}
