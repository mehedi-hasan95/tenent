"use client"

import { useAuthModal } from "@/store/useAuthModalStore"
import { RegistrationForm } from "@/components/auth-components/registration-form"
import { AuthModal } from "./auth-modal"

export const RegistrationModal = () => {
  const { isRegisterOpen, closeRegister } = useAuthModal()
  return (
    <AuthModal isOpen={isRegisterOpen} onClose={closeRegister}>
      <RegistrationForm />
    </AuthModal>
  )
}
