"use client"

import { ComboboxController } from "@/components/form/combobox-controller"
import { InputController } from "@/components/form/input-controller"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@workspace/ui/components/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
} from "@workspace/ui/components/field"
import { registrationSchema } from "@workspace/validators/validators/user-validators"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { AuthHeader } from "./auth-header"
import { VerifyEmailOtpForm } from "./verify-email-opt-form"
import { useAuthModal } from "@/store/useAuthModalStore"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { toast } from "sonner"
import { LoadingButton } from "../common/loading-button"
import { useRouter } from "next/navigation"
import {
  registrationAction,
  registrationOtpAction,
  verifyRegistrationOtpAction,
} from "@/api/auth/auth-action"

export const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState<"registration" | "verify">("registration")
  const [otp, setOtp] = useState("")
  const router = useRouter()
  const queryClient = useQueryClient()
  const { openLogin, closeRegister } = useAuthModal()
  const form = useForm<z.input<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      phone: "",
      role: "USER",
      password: "",
      confirmPassword: "",
    },
  })
  const mutation = useMutation({
    mutationFn: registrationAction,
    onError: async (error) => {
      if (error.name === "unverified") {
        await registrationOtpAction({
          email: (error as { email?: string }).email as string,
        })
        setStep("verify")
        toast.success("A verification OTP send to your email")
      } else {
        toast.error(error.message)
      }
    },

    // todo
    onSuccess: async (data) => {
      if (data?.data?.user?.id) {
        await registrationOtpAction({ email: data?.data?.user?.email })
        setStep("verify")
        toast.success("A verification OTP send to your email")
      }
      if (data?.error?.body?.code === "USERNAME_IS_ALREADY_TAKEN") {
        toast.error(data?.error?.body?.message)
      }
    },
  })
  const otpMutation = useMutation({
    mutationFn: verifyRegistrationOtpAction,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] })
      toast.success("User created successfully")
      closeRegister()
    },
  })
  function onSubmit(data: z.input<typeof registrationSchema>) {
    mutation.mutate(data)
  }
  return (
    <>
      {step === "registration" ? (
        <AuthHeader
          title="Registration"
          footer={
            <FieldDescription className="px-6 text-center">
              Already have an account?{" "}
              <span onClick={openLogin} className="cursor-pointer underline">
                Sign in
              </span>
            </FieldDescription>
          }
        >
          <div className="space-y-5">
            <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <InputController
                  control={form.control}
                  name="name"
                  title="Your Name"
                  placeholder="Mehedi"
                />
                <InputController
                  control={form.control}
                  name="email"
                  title="Your Email"
                  placeholder="me@me.com"
                  inputTypes="email"
                />
                <InputController
                  control={form.control}
                  name="username"
                  title="Username"
                  placeholder="mehedi"
                />
                <ComboboxController
                  control={form.control}
                  name="role"
                  options={[
                    { label: "User", value: "USER" },
                    { label: "Seller", value: "SELLER" },
                  ]}
                />
                <InputController
                  control={form.control}
                  name="phone"
                  title="Phone Number"
                  placeholder="+8801953218211"
                />
                <div className="relative">
                  <InputController
                    control={form.control}
                    name="password"
                    title="Password"
                    placeholder="******"
                    inputTypes={showPassword ? "text" : "password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 translate-y-1/3 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <InputController
                  control={form.control}
                  name="confirmPassword"
                  title="Confirm Password"
                  placeholder="******"
                  inputTypes="password"
                />
              </FieldGroup>
            </form>
            <Field orientation="horizontal">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              {mutation.isPending ? (
                <LoadingButton />
              ) : (
                <Button type="submit" form="form-rhf-demo">
                  Submit
                </Button>
              )}
            </Field>
          </div>
        </AuthHeader>
      ) : (
        <VerifyEmailOtpForm
          loading={false}
          onOTP={otp}
          onSubmit={() =>
            otpMutation.mutate({ email: form.getValues("email"), otp })
          }
          setOTP={setOtp}
        />
      )}
    </>
  )
}
