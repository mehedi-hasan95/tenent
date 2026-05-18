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

export const RegistrationForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState<"registration" | "verify">("registration")
  const [otp, setOtp] = useState("")
  const { openLogin } = useAuthModal()
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
  function onSubmit(data: z.input<typeof registrationSchema>) {
    console.log(data)
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
              <Button type="submit" form="form-rhf-demo">
                Submit
              </Button>
            </Field>
          </div>
        </AuthHeader>
      ) : (
        <VerifyEmailOtpForm
          loading={false}
          onOTP={otp}
          onSubmit={() => {}}
          setOTP={setOtp}
        />
      )}
    </>
  )
}
