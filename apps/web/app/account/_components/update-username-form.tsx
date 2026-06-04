"use client"

import { updateUsernameAction } from "@/api/auth/auth-action"
import { LoadingButton } from "@/components/common/loading-button"
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
import { updateUsernameValidator } from "@workspace/validators/validators/user-validators"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
export const UpdateUsernameForm = () => {
  const { setIsOpen } = useIsProfileEditableStore()
  const form = useForm<z.infer<typeof updateUsernameValidator>>({
    resolver: zodResolver(updateUsernameValidator),
    defaultValues: {
      username: "",
    },
  })
  const mutation = useMutation({
    mutationFn: updateUsernameAction,
    onSuccess: (data) => {
      if (data?.error) {
        toast.error(data?.error?.body?.message)
      }
      toast.success("Username update successfully")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
  function onSubmit(data: z.infer<typeof updateUsernameValidator>) {
    mutation.mutate(data)
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Username</CardTitle>
        <CardDescription>Enter a unique username to continue.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form id="update-username-rhf" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <InputController
              control={form.control}
              name="username"
              title="New Username"
              placeholder="mehedi"
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
            <Button type="submit" form="update-username-rhf">
              Update Password
            </Button>
          )}
        </Field>
      </CardContent>
    </Card>
  )
}
