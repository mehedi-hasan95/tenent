"use client"

import {
  useCategoryMutation,
  useGetCategories,
} from "@/hooks/categories/use-categories"
import { TrashList } from "./trash-list"
import { DataTable } from "@/components/common/data-table/data-table"
import { CategoriesColumns } from "./categories-columns"
import { DataTableToolbar } from "@/components/common/data-table/data-table-toolbar"
import {
  deleteAllCategoryAction,
  deleteCategoryAction,
  deleteSelectedCategoryAction,
  restoreCategoryAction,
} from "@/api/categories/categories-action"
import { useDeleteModalStore } from "@/store/useDeleteStore"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { categoriesType } from "@workspace/validators/types/categories.types"

export const AdminTrashPage = () => {
  const { data } = useGetCategories("false")
  const { onOpen } = useDeleteModalStore()

  const deleteMutation = useCategoryMutation({
    mutationFn: deleteCategoryAction,
    successMessage: "Category deleted successfully",
    onSuccessClose: () => onOpen(false),
  })
  const restoreMutation = useCategoryMutation({
    mutationFn: restoreCategoryAction,
    successMessage: "Category restored successfully",
    onSuccessClose: () => onOpen(false),
  })
  const deleteSelectedMutation = useCategoryMutation({
    mutationFn: deleteSelectedCategoryAction,
    successMessage: "Category delete successfully",
  })

  const queryClient = useQueryClient()
  const deleteAllMutation = useMutation({
    mutationFn: deleteAllCategoryAction,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["categories"],
      })

      const previousCategories = queryClient.getQueryData<categoriesType[]>([
        "categories",
      ])

      queryClient.setQueryData<categoriesType[]>(["categories"], (old = []) =>
        old.filter((cat) => !cat.deleted_at)
      )

      return { previousCategories }
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["categories"], context?.previousCategories)
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      })
    },
  })

  return (
    <div>
      <TrashList
        title="Trashed Categories"
        onDelete={deleteAllMutation.mutate}
        deleteBtn="Delete All Categories"
        disabled={data?.length ? true : false}
      >
        <DataTable
          columns={CategoriesColumns({
            onDelete: deleteMutation.mutate,
            onRestore: restoreMutation.mutate,
          })}
          data={data ?? []}
          searchKey="name"
          toolbar={(table) => (
            <DataTableToolbar
              table={table}
              onDelete={(slug) => deleteSelectedMutation.mutate(slug)}
            />
          )}
        />
      </TrashList>
    </div>
  )
}
