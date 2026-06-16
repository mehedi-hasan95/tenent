"use client"

import { TrashList } from "./trash-list"
import { DataTable } from "@/components/common/data-table/data-table"
import { DataTableToolbar } from "@/components/common/data-table/data-table-toolbar"

import { useDeleteModalStore } from "@/store/useDeleteStore"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { subCategoriesType } from "@workspace/validators/types/categories.types"
import { SubCategoriesColumns } from "./sub-categories-columns"
import { useSubCategoryMutation } from "@/hooks/categories/use-subcategory"
import {
  deleteAllSubCategoryAction,
  deleteSelectedSubCategoryAction,
  deleteSubCategoryAction,
  restoreSubCategoryAction,
} from "@/api/categories/subcategories-action"

interface Props {
  data: subCategoriesType[] | undefined
}
export const AdminSubCategoriesTrashPage = ({ data }: Props) => {
  const { onOpen } = useDeleteModalStore()

  const deleteMutation = useSubCategoryMutation({
    mutationFn: deleteSubCategoryAction,
    successMessage: "Sub Category deleted successfully",
    onSuccessClose: () => onOpen(false),
  })
  const restoreMutation = useSubCategoryMutation({
    mutationFn: restoreSubCategoryAction,
    successMessage: "Sub Category restored successfully",
    onSuccessClose: () => onOpen(false),
  })
  const deleteSelectedMutation = useSubCategoryMutation({
    mutationFn: deleteSelectedSubCategoryAction,
    successMessage: "Sub Category delete successfully",
  })

  const queryClient = useQueryClient()
  const deleteAllMutation = useMutation({
    mutationFn: deleteAllSubCategoryAction,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["sub-categories"],
      })

      const previousCategories = queryClient.getQueryData<subCategoriesType[]>([
        "sub-categories",
      ])

      queryClient.setQueryData<subCategoriesType[]>(
        ["sub-categories"],
        (old = []) => old.filter((cat) => !cat.deleted_at)
      )

      return { previousCategories }
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["sub-categories"], context?.previousCategories)
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["sub-categories"],
      })
    },
  })

  return (
    <>
      {Boolean(data?.length) && (
        <TrashList
          title="Trashed Sub Categories"
          onDelete={deleteAllMutation.mutate}
          deleteBtn="Delete Sub Categories"
          disabled={data?.length ? true : false}
        >
          <DataTable
            columns={SubCategoriesColumns({
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
      )}
    </>
  )
}
