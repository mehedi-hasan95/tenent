"use client"

import { useAuthModal } from "@/store/useAuthModalStore"
import { AuthHeader } from "./auth-header"
import {
  Field,
  FieldDescription,
  FieldGroup,
} from "@workspace/ui/components/field"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@workspace/ui/components/button"
import { loginSchema } from "@workspace/validators/validators/user-validators"
import { InputController } from "../form/input-controller"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { CheckboxController } from "../form/checkbox-contoller"
import { useMutation } from "@tanstack/react-query"
import { loginAction } from "@/api/auth/auth"
import { LoadingButton } from "../common/loading-button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export const SignInForm = () => {
  const { openRegister, closeLogin } = useAuthModal()
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  })
  const mutation = useMutation({
    mutationFn: loginAction,
    onError: (error) => {
      toast.error("Error", { description: error.message })
    },
    onSuccess: () => {
      toast.success("Login Successfully")
      router.refresh()
      closeLogin()
    },
  })
  function onSubmit(data: z.infer<typeof loginSchema>) {
    mutation.mutate(data)
  }

  return (
    <AuthHeader
      title="Login"
      footer={
        <FieldDescription className="px-6 text-center">
          Don&apos;t have an account?{" "}
          <span onClick={openRegister} className="cursor-pointer underline">
            Sign Up
          </span>
        </FieldDescription>
      }
    >
      <div className="space-y-4">
        <form id="login-rhf" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <InputController
              control={form.control}
              name="email"
              title="Your Email"
              inputTypes="email"
              placeholder="me@me.com"
            />
            <div className="relative">
              <InputController
                control={form.control}
                name="password"
                title="Password"
                placeholder="******"
                inputTypes={showPassword ? "text" : "password"}
                otherLink={
                  <Link
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 translate-y-1/3 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <CheckboxController control={form.control} name="rememberMe" />
          </FieldGroup>
        </form>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          {mutation.isPending ? (
            <LoadingButton />
          ) : (
            <Button type="submit" form="login-rhf">
              Sign In
            </Button>
          )}
        </Field>
      </div>
    </AuthHeader>
  )
}
