"use client"
import {
  createCategoryAction,
  updateCategoryAction,
} from "@/api/categories/categories-action"
import { LoadingButton } from "@/components/common/loading-button"
import { ImagePreviewController } from "@/components/form/image-preview-controller"
import { ImageUploadController } from "@/components/form/image-upload-controller"
import { InputController } from "@/components/form/input-controller"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"
import { Button } from "@workspace/ui/components/button"
import { FieldGroup } from "@workspace/ui/components/field"
import { categoriesType } from "@workspace/validators/types/categories.types"
import { categoriesValidators } from "@workspace/validators/validators/categories-validators"
import { slugify } from "@workspace/validators/validators/regex"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

interface Props {
  isOpen: boolean
  onClose: () => void
  category: categoriesType | null
}
export const CreateCategoryModal = ({ isOpen, onClose, category }: Props) => {
  const [isSlugEdited, setIsSlugEdited] = useState(false)
  const prevTitleRef = useRef("")
  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof categoriesValidators>>({
    resolver: zodResolver(categoriesValidators),
    defaultValues: {
      name: category?.name || "",
      slug: category?.slug || "",
      image: undefined,
      previousImage: category?.image || undefined,
    },
  })
  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        slug: category.slug,
        image: undefined,
        previousImage: category.image || undefined,
      })
    } else {
      form.reset({
        name: "",
        slug: "",
        image: undefined,
        previousImage: undefined,
      })
    }
  }, [category, form])
  const name = form.watch("name")
  const getSlug = form.watch("slug")

  // Initialize slug edit state and title ref if editing
  useEffect(() => {
    if (category?.id) {
      form.setValue("slug", category?.slug)
      prevTitleRef.current = category?.name
      setIsSlugEdited(true)
    }
  }, [category, form])

  // Auto-generate slug from title unless manually edited
  useEffect(() => {
    if (!isSlugEdited && slugify(prevTitleRef.current) === getSlug) {
      const newSlug = slugify(name)
      form.setValue("slug", newSlug)
      prevTitleRef.current = name
    }
  }, [name, getSlug, isSlugEdited, form])

  /**
   * ============================================================
   * 📌 Action: Create Category
   * ============================================================
   */
  const createMutation = useMutation({
    mutationFn: createCategoryAction,
    onSuccess: (data) => {
      if (data.data.id) {
        toast.success("Category created successfully")
        queryClient.invalidateQueries({ queryKey: ["categories"] })
        onClose()
        form.reset()
      }
    },
    onError: () => {
      toast.error("Filed to create category")
    },
  })

  /**
   * ============================================================
   * 📌 Action: Update Category
   * ============================================================
   */
  const updateMutation = useMutation({
    mutationFn: updateCategoryAction,
    onSuccess: () => {
      toast.success("Update Category Successfully")
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      onClose()
      form.reset()
    },
    onError: () => {
      toast.error("Filed to update category")
    },
  })
  function onSubmit(data: z.infer<typeof categoriesValidators>) {
    if (category?.id) {
      updateMutation.mutate({
        id: category.id,
        name: data.name,
        slug: data.slug,
        image: data.image,
        previousImage: data.previousImage,
      })
    } else {
      createMutation.mutate(data)
    }
  }
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
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
                  mode="single"
                  control={form.control}
                  title="Category Image"
                  name="image"
                />
              </FieldGroup>
              <div className="mt-5 flex gap-4">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                {createMutation.isPending || updateMutation.isPending ? (
                  <LoadingButton />
                ) : (
                  <Button type="submit">Continue</Button>
                )}
              </div>
            </form>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  )
}
