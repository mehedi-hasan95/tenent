"use client"

import { AuthHeader } from "@/components/auth/auth-header"
import { LoadingButton } from "@/components/common/loading-button"
import { InputController } from "@/components/form/input-controller"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@workspace/ui/components/button"
import { Field, FieldGroup } from "@workspace/ui/components/field"
import { ChevronRight } from "lucide-react"
import { useForm } from "react-hook-form"
import z from "zod"

const formSchema = z.object({
  password: z.string(),
})
interface Props {
  onSubmit: (data: { password: string }) => void
  loading?: boolean
}
export const PasswordReset = ({ onSubmit, loading }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  })

  return (
    <AuthHeader
      title="Forgot your password?"
      desc="Provide the email associated with your account to receive password reset instructions."
    >
      <div className="space-y-4">
        <form id="forgot-password-rhf" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <InputController
              control={form.control}
              name="password"
              title="Your Password"
              inputTypes="password"
              placeholder="******"
              disabled={loading}
            />
          </FieldGroup>
        </form>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          {loading ? (
            <LoadingButton />
          ) : (
            <Button type="submit" form="forgot-password-rhf">
              Continue
              <ChevronRight />
            </Button>
          )}
        </Field>
      </div>
    </AuthHeader>
  )
}
