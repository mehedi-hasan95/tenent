"use client"
import { ImageUploadController } from "@/components/form/image-upload-controller"
import { InputController } from "@/components/form/input-controller"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog"
import { Button } from "@workspace/ui/components/button"
import { FieldGroup } from "@workspace/ui/components/field"
import { categoriesValidators } from "@workspace/validators/validators/categories-validators"
import { JSX, useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"

interface Props {
  trigger?: JSX.Element
}
export const CreateCategoryModal = ({
  trigger = <Button variant="outline">Show Dialog</Button>,
}: Props) => {
  const [open, setOpen] = useState(false)
  const form = useForm<z.infer<typeof categoriesValidators>>({
    resolver: zodResolver(categoriesValidators),
    defaultValues: {
      name: "",
      slug: "",
      image: undefined,
      previousImage: undefined,
    },
  })
  function onSubmit(data: z.infer<typeof categoriesValidators>) {
    console.log(data)
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Create a category</AlertDialogTitle>
          <AlertDialogDescription className="w-full" asChild>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <InputController
                  control={form.control}
                  name="name"
                  title="Category Name"
                  placeholder="e.g. Mobile"
                />
                <InputController
                  control={form.control}
                  name="slug"
                  title="Category Slug"
                  placeholder="e.g. mobile"
                />
                <ImageUploadController
                  mode="single"
                  control={form.control}
                  title="Category Image"
                  name="image"
                />
              </FieldGroup>
              <div className="mt-5 flex gap-4">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button type="submit">Continue</Button>
              </div>
            </form>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  )
}
