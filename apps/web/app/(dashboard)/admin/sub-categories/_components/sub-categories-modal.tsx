"use client"

import { subCategoriesType } from "@workspace/validators/types/categories.types"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"
import { useEffect, useRef, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import z from "zod"
import { subCategoriesValidators } from "@workspace/validators/validators/categories-validators"
import { zodResolver } from "@hookform/resolvers/zod"
import { slugify } from "@workspace/validators/validators/regex"
import { FieldGroup } from "@workspace/ui/components/field"
import { InputController } from "@/components/form/input-controller"
import { Button } from "@workspace/ui/components/button"
import { useGetCategories } from "@/hooks/categories/use-categories"
import { SelectController } from "@/components/form/select-controller"
import {
  createSubCategoryAction,
  updateSubCategoryAction,
} from "@/api/categories/subcategories-action"

interface Props {
  isOpen: boolean
  onClose: () => void
  category: subCategoriesType | null
}

export const SubCategoriesModal = ({ category, isOpen, onClose }: Props) => {
  const [isSlugEdited, setIsSlugEdited] = useState(false)
  const prevTitleRef = useRef("")
  const { data: cat } = useGetCategories("true")
  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof subCategoriesValidators>>({
    resolver: zodResolver(subCategoriesValidators),
    defaultValues: {
      name: category?.name || "",
      slug: category?.slug || "",
      categorySlug: category?.categorySlug || "",
    },
  })

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        slug: category.slug,
        categorySlug: category.categorySlug,
      })
      prevTitleRef.current = category.name
      setIsSlugEdited(true)
    } else {
      form.reset({
        name: "",
        slug: "",
        categorySlug: "",
      })
      prevTitleRef.current = ""
      setIsSlugEdited(false)
    }
  }, [category, form])

  const name = form.watch("name")
  const getSlug = form.watch("slug")

  // Auto-generate slug from title unless manually edited
  useEffect(() => {
    if (!isSlugEdited && slugify(prevTitleRef.current) === getSlug) {
      const newSlug = slugify(name)
      form.setValue("slug", newSlug)
      prevTitleRef.current = name
    }
  }, [name, getSlug, isSlugEdited, form])

  const createMutation = useMutation({
    mutationFn: createSubCategoryAction,

    onMutate: async (newSubCategory) => {
      await queryClient.cancelQueries({
        queryKey: ["sub-categories"],
      })
      const previousSubCategories = queryClient.getQueryData(["sub-categories"])
      queryClient.setQueryData(
        ["sub-categories"],
        (old: subCategoriesType[] = []) => [
          ...old,
          {
            id: `temp-${Date.now()}`, // temporary id
            ...newSubCategory,
          },
        ]
      )
      onClose()
      form.reset()
      return { previousSubCategories }
    },

    onError: (_error, _newSubCategory, context) => {
      queryClient.setQueryData(
        ["sub-categories"],
        context?.previousSubCategories
      )
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["sub-categories"],
      })
    },
  })
  // update mutation
  const updateMutation = useMutation({
    mutationFn: updateSubCategoryAction,

    onMutate: async (newSubCategory) => {
      await queryClient.cancelQueries({
        queryKey: ["sub-categories"],
      })
      const previousSubCategories = queryClient.getQueryData(["sub-categories"])
      queryClient.setQueryData(
        ["sub-categories"],
        (old: subCategoriesType[] = []) => [
          ...old,
          {
            ...newSubCategory,
          },
        ]
      )
      onClose()
      form.reset()
      return { previousSubCategories }
    },

    onError: (_error, _newSubCategory, context) => {
      queryClient.setQueryData(
        ["sub-categories"],
        context?.previousSubCategories
      )
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["sub-categories"],
      })
    },
  })
  function onSubmit(data: z.infer<typeof subCategoriesValidators>) {
    if (category?.id) {
      updateMutation.mutate({ ...data, id: category.id })
      return
    }
    createMutation.mutate(data)
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {category?.id ? "Update Sub Category" : "Create Sub Category"}
          </AlertDialogTitle>
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
                <SelectController
                  control={form.control}
                  name="categorySlug"
                  options={
                    cat?.map((item) => ({
                      label: item.name,
                      value: item.slug,
                    })) ?? []
                  }
                  title="Select a Category"
                  placeholder="Select Category"
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
