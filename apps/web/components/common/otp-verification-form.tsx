"use client"

import { ModifyOtp } from "@/components/modify/otp-modify"
import { useEffect, useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

interface Props {
  setOTP: React.Dispatch<React.SetStateAction<string>>
  onOTP: string
  onSubmit: () => void
  validTill?: number
  loading: boolean
}
export const OtpVerificationForm = ({
  onOTP,
  setOTP,
  onSubmit,
  validTill = 300,
  loading,
}: Props) => {
  const [timeLeft, setTimeLeft] = useState<number>(validTill)
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true)
  useEffect(() => {
    if (timeLeft > 0 && isTimerActive) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      setIsTimerActive(false)
    }
  }, [timeLeft, isTimerActive])

  // Format time display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <ModifyOtp otp={onOTP} setOtp={setOTP} />
      <div className="text-center">
        <div className="mb-4 text-sm text-muted-foreground">
          {isTimerActive ? (
            <>
              Time remaining:{" "}
              <span className="font-mono font-semibold">
                {formatTime(timeLeft)}
              </span>
            </>
          ) : (
            <span className="text-red-500">Code expired</span>
          )}
        </div>
        {loading ? (
          "loading.."
        ) : (
          <Button
            type="submit"
            className={cn("mb-3 w-full")}
            disabled={onOTP.length !== 6 || timeLeft === 0}
            onClick={onSubmit}
          >
            Verify Code
          </Button>
        )}
      </div>
    </div>
  )
}
