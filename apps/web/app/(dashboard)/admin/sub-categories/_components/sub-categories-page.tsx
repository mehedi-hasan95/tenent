"use client"

import { useGetSubCategories } from "@/hooks/categories/use-subcategory"
import { SubCategoriesGrid } from "./sub-categories-grid"
import { Separator } from "@workspace/ui/components/separator"
import { useState } from "react"
import { subCategoriesType } from "@workspace/validators/types/categories.types"
import { Button } from "@workspace/ui/components/button"
import { PlusCircle } from "lucide-react"
import { SubCategoriesModal } from "./sub-categories-modal"
import { DeleteCategoryModal } from "../../categories/_components/delete-category-modal"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { trashingSubCategoryAction } from "@/api/categories/subcategories-action"

export const SubCategoriesPage = () => {
  const { data } = useGetSubCategories("true")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] =
    useState<subCategoriesType | null>(null)

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null)

  const handleOpenModal = () => {
    setEditingCategory(null)
    setIsModalOpen(true)
  }
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingCategory(null)
  }
  const handleEditCategory = (category: subCategoriesType) => {
    setEditingCategory(category)
    setIsModalOpen(true)
  }

  const handleDeleteModal = () => {
    setDeleteModalOpen(false)
    setDeletingCategory(null)
  }
  const handleDeleteCategory = (category: string) => {
    setDeletingCategory(category)
    setDeleteModalOpen(true)
  }

  const queryClient = useQueryClient()
  const deleteCategoryMutation = useMutation({
    mutationFn: trashingSubCategoryAction,
    // onSuccess: (data) => {
    //   console.log(data)
    // },
    // onError: (error) => {
    //   console.log("error: ", error)
    // },
    onMutate: async (categoryId) => {
      await queryClient.cancelQueries({
        queryKey: ["sub-categories"],
      })

      const previousCategories = queryClient.getQueryData<subCategoriesType[]>([
        "sub-categories",
      ])

      queryClient.setQueryData<subCategoriesType[]>(
        ["sub-categories"],
        (old = []) => old.filter((cat) => cat.id !== categoryId)
      )

      setDeleteModalOpen(false)
      return { previousCategories }
    },

    onError: (_error, _categoryId, context) => {
      queryClient.setQueryData(["sub-categories"], context?.previousCategories)
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["sub-categories"],
      })
    },
  })
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-bold text-foreground">
            Categories ({data?.length})
          </h1>
          <p className="text-muted-foreground">
            Manage your sub categories and organize your inventory
          </p>
        </div>
        <Button
          onClick={handleOpenModal}
          className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg transition-colors hover:bg-primary/90 hover:shadow-xl"
        >
          <PlusCircle size={20} />
          Create Category
        </Button>
      </div>
      <Separator />
      <SubCategoriesGrid
        subCategories={data ?? []}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
      />
      <SubCategoriesModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        category={editingCategory}
      />
      <DeleteCategoryModal
        open={deleteModalOpen}
        onOpenChange={handleDeleteModal}
        onSubmit={() =>
          deletingCategory && deleteCategoryMutation.mutate(deletingCategory)
        }
      />
    </div>
  )
}
