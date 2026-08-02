"use client"

import { useProductsMutation } from "@/hooks/categories/use-categories"
import { DataTable } from "@/components/common/data-table/data-table"
import { DataTableToolbar } from "@/components/common/data-table/data-table-toolbar"
import { useModalActiveStore } from "@/store/useModalActiveStore"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { TrashList } from "@/app/(dashboard)/admin/trash/_components/trash-list"
import { PRODUCT_TYPE } from "@workspace/validators/types/product.types"
import { ProductsColumns } from "./products-columns"
import {
  deleteAllProductsAction,
  deleteSelectedProductsAction,
  deleteSingleProductsAction,
  restoreProductAction,
} from "@/api/products/seller-products-action"
import {
  CACHE_ALL_PRODUCTS,
  CACHE_SELLER_PRODUCTS_KEYS,
} from "@/lib/query-cache"

interface Props {
  data: PRODUCT_TYPE[] | undefined
}
export const ProductsTrashPage = ({ data }: Props) => {
  const { onOpen } = useModalActiveStore()

  const deleteMutation = useProductsMutation({
    mutationFn: deleteSingleProductsAction,
    successMessage: "Product deleted successfully",
    onSuccessClose: () => onOpen(false),
  })
  const restoreMutation = useProductsMutation({
    mutationFn: restoreProductAction,
    successMessage: "Product restored successfully",
    onSuccessClose: () => onOpen(false),
  })
  const deleteSelectedMutation = useProductsMutation({
    mutationFn: deleteSelectedProductsAction,
    successMessage: "Products delete successfully",
  })

  const queryClient = useQueryClient()
  const deleteAllMutation = useMutation({
    mutationFn: deleteAllProductsAction,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["trashed-products"],
      })

      const previousProducts = queryClient.getQueryData<PRODUCT_TYPE[]>([
        "trashed-products",
      ])

      queryClient.setQueryData<PRODUCT_TYPE[]>(
        ["trashed-products"],
        (old = []) => old.filter((cat) => !cat.deletedAt)
      )

      return { previousProducts }
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["trashed-products"], context?.previousProducts)
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["trashed-products"],
      })
      queryClient.invalidateQueries({
        queryKey: CACHE_ALL_PRODUCTS(),
      })
      queryClient.invalidateQueries({
        queryKey: CACHE_SELLER_PRODUCTS_KEYS,
      })
    },
  })

  return (
    <>
      {Boolean(data?.length) && (
        <TrashList
          title="Trashed Products"
          onDelete={deleteAllMutation.mutate}
          deleteBtn="Delete All Products"
          disabled={data?.length ? true : false}
        >
          <DataTable
            columns={ProductsColumns({
              onDelete: deleteMutation.mutate,
              onRestore: restoreMutation.mutate,
            })}
            data={data ?? []}
            searchKey="title"
            toolbar={(table) => (
              <DataTableToolbar
                table={table}
                onDelete={(id) => deleteSelectedMutation.mutate(id)}
                getDeleteId={(row) => row.id}
              />
            )}
          />
        </TrashList>
      )}
    </>
  )
}
