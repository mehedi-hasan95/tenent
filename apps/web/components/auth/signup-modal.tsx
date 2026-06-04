"use client"

import { useAuthModal } from "@/store/useAuthModalStore"
import { AuthModal } from "./auth-modal"
import { SignupForm } from "./signup-form"

export const SignupModal = () => {
  const { isRegisterOpen, closeRegister } = useAuthModal()
  return (
    <AuthModal isOpen={isRegisterOpen} onClose={closeRegister}>
      <SignupForm />
    </AuthModal>
  )
}
