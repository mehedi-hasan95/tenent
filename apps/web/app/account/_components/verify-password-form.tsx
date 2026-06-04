"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { FieldGroup } from "@workspace/ui/components/field"
import { JSX } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { useIsProfileEditableStore } from "@/store/useVerifyPasswordModalStore"
import { verifyPasswordAction } from "@/api/auth/auth-action"
import { InputController } from "@/components/form/input-controller"
import { LoadingButton } from "@/components/common/loading-button"

interface Props {
  trigger?: JSX.Element
}

const formSchema = z.object({
  password: z.string(),
})

export const VerifyPasswordForm = ({ trigger = <>Open</> }: Props) => {
  const { setIsOpen } = useIsProfileEditableStore()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  })

  const mutation = useMutation({
    mutationFn: verifyPasswordAction,
    onSuccess: () => {
      setIsOpen(true)
    },
    onError: (error) => {
      toast.error((error as { error?: string }).error)
    },
  })
  function onSubmit(data: z.infer<typeof formSchema>) {
    mutation.mutate(data)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{trigger}</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Verify Password</DialogTitle>
          <DialogDescription>Enter your password</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <InputController
              control={form.control}
              name="password"
              inputTypes="password"
            />
          </FieldGroup>

          {mutation.isPending ? (
            <LoadingButton title="Verifying..." />
          ) : (
            <Button type="submit">Verify</Button>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
