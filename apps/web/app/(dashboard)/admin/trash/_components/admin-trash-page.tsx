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
  deleteCategoryAction,
  restoreCategoryAction,
} from "@/api/categories/categories-action"
import { useDeleteModalStore } from "@/store/useDeleteStore"

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

  return (
    <div>
      <TrashList
        title="Trashed Categories"
        onDelete={() => {}}
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
          toolbar={(table) => <DataTableToolbar table={table} />}
        />
      </TrashList>
    </div>
  )
}
