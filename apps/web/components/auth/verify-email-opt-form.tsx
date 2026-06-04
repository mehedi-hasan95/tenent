"use client"

import { OtpVerificationForm } from "../common/otp-verification-form"
import { AuthHeader } from "./auth-header"

interface Props {
  setOTP: React.Dispatch<React.SetStateAction<string>>
  onOTP: string
  onSubmit: () => void
  validTill?: number
  loading: boolean
}
export const VerifyEmailOtpForm = ({
  onOTP,
  setOTP,
  onSubmit,
  validTill = 300,
  loading,
}: Props) => {
  return (
    <AuthHeader
      title="Secure Verification"
      desc="To keep your account safe, we just sent a one-time code to your inbox."
    >
      <OtpVerificationForm
        loading={loading}
        onOTP={onOTP}
        onSubmit={onSubmit}
        setOTP={setOTP}
        validTill={validTill}
      />
    </AuthHeader>
  )
}
