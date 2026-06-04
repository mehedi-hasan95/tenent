"use client"

import { updateUserAction } from "@/api/auth/auth-action"
import { LoadingButton } from "@/components/common/loading-button"
import { ImagePreviewController } from "@/components/form/image-preview-controller"
import { ImageUploadController } from "@/components/form/image-upload-controller"
import { InputController } from "@/components/form/input-controller"
import { useGetUser } from "@/hooks/auth/use-auth"
import { useIsProfileEditableStore } from "@/store/useVerifyPasswordModalStore"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@workspace/ui/components/button"
import { Field, FieldGroup } from "@workspace/ui/components/field"
import { updateUserSchema } from "@workspace/validators/validators/user-validators"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

export const UpdateUserProfile = () => {
  const { data: user } = useGetUser()
  const queryClient = useQueryClient()
  const { setIsOpen } = useIsProfileEditableStore()
  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      image: undefined,
      name: user?.name ?? "",
      phone: user?.phone || "",
      previousImage: user?.image || "",
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateUserAction,
    onSuccess: () => {
      toast.success("User update successfully")
      queryClient.invalidateQueries({ queryKey: ["session"] })
      queryClient.invalidateQueries({ queryKey: ["user"] })
      setIsOpen(false)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  function onSubmit(data: z.infer<typeof updateUserSchema>) {
    updateMutation.mutate(data)
  }
  return (
    <div className="space-y-4">
      <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <InputController
            control={form.control}
            name="name"
            title="your name"
            placeholder="Mehedi"
            disabled={updateMutation.isPending}
          />
          <InputController
            control={form.control}
            name="phone"
            title="Phone Number"
            placeholder="+8801953218211"
            disabled={updateMutation.isPending}
          />
          {form.watch && (
            <ImagePreviewController
              mode="single"
              control={form.control}
              name="previousImage"
              title="Profile Image"
              url={form.watch("previousImage") ?? ""}
            />
          )}
          <ImageUploadController
            control={form.control}
            name="image"
            mode="single"
            disabled={updateMutation.isPending}
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
        {updateMutation.isPending ? (
          <LoadingButton title="Updating..." />
        ) : (
          <Button type="submit" form="form-rhf-demo">
            Update
          </Button>
        )}
      </Field>
    </div>
  )
}
