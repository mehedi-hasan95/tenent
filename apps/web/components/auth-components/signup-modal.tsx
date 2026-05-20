"use client"

import { useAuthModal } from "@/store/useAuthModalStore"
import { SignupForm } from "@/components/auth-components/signup-form"
import { AuthModal } from "./auth-modal"

export const SignupModal = () => {
  const { isRegisterOpen, closeRegister } = useAuthModal()
  return (
    <AuthModal isOpen={isRegisterOpen} onClose={closeRegister}>
      <SignupForm />
    </AuthModal>
  )
}
