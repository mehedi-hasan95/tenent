"use client"

import { updatePasswordAction } from "@/api/auth/auth-action"
import { LoadingButton } from "@/components/common/loading-button"
import { CheckboxController } from "@/components/form/checkbox-controller"
import { InputController } from "@/components/form/input-controller"
import { useIsProfileEditableStore } from "@/store/useVerifyPasswordModalStore"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Field, FieldGroup } from "@workspace/ui/components/field"
import { updatePasswordValidator } from "@workspace/validators/validators/user-validators"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
export const UpdatePasswordForm = () => {
  const { setIsOpen } = useIsProfileEditableStore()
  const form = useForm<z.infer<typeof updatePasswordValidator>>({
    resolver: zodResolver(updatePasswordValidator),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
      currentPassword: "",
      revokeOtherSessions: true,
    },
  })
  const mutation = useMutation({
    mutationFn: updatePasswordAction,
    onSuccess: () => {
      toast.success("Update Password Successfully")
      setIsOpen(false)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
  function onSubmit(data: z.infer<typeof updatePasswordValidator>) {
    mutation.mutate(data)
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <CardDescription>
          Create a new password to improve your account security and keep your
          data safe.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form id="update-password-rhf" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <InputController
              control={form.control}
              name="currentPassword"
              title="Current Password"
              placeholder="******"
              inputTypes="password"
            />
            <InputController
              control={form.control}
              name="newPassword"
              title="New Password"
              placeholder="******"
              inputTypes="password"
            />
            <InputController
              control={form.control}
              name="confirmPassword"
              title="Confirm Password"
              placeholder="******"
              inputTypes="password"
            />
            <CheckboxController
              control={form.control}
              name="revokeOtherSessions"
              label="Revoke Other Sessions?"
            />
          </FieldGroup>
        </form>
        <Field orientation="horizontal">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Close
          </Button>
          {mutation.isPending ? (
            <LoadingButton title="Update Password" />
          ) : (
            <Button type="submit" form="update-password-rhf">
              Update Password
            </Button>
          )}
        </Field>
      </CardContent>
    </Card>
  )
}
