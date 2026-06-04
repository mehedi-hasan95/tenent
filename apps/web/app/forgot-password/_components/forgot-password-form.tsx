"use client"
import { useState } from "react"
import { ForgotPasswordEmail } from "./forgot-password-email"
import { useMutation } from "@tanstack/react-query"

import { toast } from "sonner"
import { PasswordReset } from "./password-reset"
import { redirect, useRouter } from "next/navigation"
import { useGetSession } from "@/hooks/auth/use-auth"
import {
  resetPasswordAction,
  resetPasswordEmailAction,
  resetPasswordOtpAction,
} from "@/api/auth/auth-action"
import { VerifyEmailOtpForm } from "@/components/auth/verify-email-opt-form"
import { apiError } from "@workspace/validators/types/constants.types"

export const ForgotPasswordForm = () => {
  const { user } = useGetSession()
  const [step, setStep] = useState<"email" | "otp" | "password">("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const router = useRouter()
  const emailMutation = useMutation({
    mutationFn: resetPasswordEmailAction,

    onSuccess: (data, variables) => {
      if (data.data.success) {
        toast.success(data.message)
        setEmail(variables.email)
        setStep("otp")
      }
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const resetPasswordOtpMutation = useMutation({
    mutationFn: resetPasswordOtpAction,
    onSuccess: () => {
      toast.success("Set Your New Password")
      setStep("password")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
  const handlerOtp = () => {
    resetPasswordOtpMutation.mutate({ email, otp })
  }

  /**
   * ============================================================
   * 📌 Password Reset
   * ============================================================
   */

  const passwordMutation = useMutation({
    mutationFn: resetPasswordAction,
    onSuccess: () => {
      toast.success("Password reset successfully")
      router.push("/")
    },
    onError: (error) => {
      if ((error as apiError).errors?.[0]?.code === "too_small") {
        toast.error((error as apiError)?.errors?.[0]?.message)
      }

      if ((error as { code?: string })?.code === "INVALID_OTP") {
        toast.error(error.message)
      }
    },
  })

  const handlePassword = (data: { password: string }) => {
    passwordMutation.mutate({
      email,
      otp,
      password: data.password,
    })
  }

  if (user) {
    redirect("/")
  }
  return (
    <>
      {step === "email" ? (
        <ForgotPasswordEmail
          onSubmit={emailMutation.mutate}
          loading={emailMutation.isPending}
        />
      ) : step === "otp" ? (
        <VerifyEmailOtpForm
          loading={resetPasswordOtpMutation.isPending}
          onOTP={otp}
          setOTP={setOtp}
          onSubmit={() => handlerOtp()}
        />
      ) : (
        <PasswordReset
          onSubmit={handlePassword}
          loading={passwordMutation.isPending}
        />
      )}
    </>
  )
}
