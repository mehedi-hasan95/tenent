"use client"

import {
  sellerAllProductsAction,
  trashedProductAction,
} from "@/api/products/seller-products-action"
import { DataTable } from "@/components/common/data-table/data-table"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { VendorProductsColumns } from "./_components/vendor-data-table/vendor-products-columns"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { PlusCircle } from "lucide-react"
import { Separator } from "@workspace/ui/components/separator"
import { DataTableFilter } from "@/components/common/data-table/data-table-filter"
import { statuses } from "@/utils/constructor"
import {
  CACHE_ALL_PRODUCTS,
  CACHE_SELLER_PRODUCTS_KEYS,
} from "@/lib/query-cache"
import { PRODUCT_TYPE } from "@workspace/validators/types/product.types"
import { toast } from "sonner"
import { useGetVendorAllProducts } from "@/hooks/products/use-products"

const Page = () => {
  const { data } = useGetVendorAllProducts()

  const queryClient = useQueryClient()

  const trashedMutation = useMutation({
    mutationFn: trashedProductAction,

    // Optimistic update
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({
        queryKey: CACHE_SELLER_PRODUCTS_KEYS,
      })
      const previousProducts = queryClient.getQueryData<PRODUCT_TYPE[]>(
        CACHE_SELLER_PRODUCTS_KEYS
      )

      queryClient.setQueryData<PRODUCT_TYPE[]>(
        CACHE_SELLER_PRODUCTS_KEYS,
        (old = []) => old.filter((product) => product.id !== id)
      )
      return { previousProducts }
    },

    onError: (error, variables, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(
          CACHE_SELLER_PRODUCTS_KEYS,
          context.previousProducts
        )
      }

      toast.error("Failed to delete product")
      console.error(error)
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: CACHE_SELLER_PRODUCTS_KEYS,
      })
      queryClient.invalidateQueries({
        queryKey: CACHE_ALL_PRODUCTS(),
      })
      queryClient.invalidateQueries({
        queryKey: ["trashed-products"],
      })
    },
  })
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold md:text-2xl">
          Products ({data?.length})
        </h2>

        <Link href="/vendor/products/create-product">
          <Button size="lg">
            <PlusCircle />
            Create Product
          </Button>
        </Link>
      </div>

      <Separator className="my-3" />
      {data?.length ? (
        <div>
          <DataTable
            columns={VendorProductsColumns({
              onDelete: (id) => trashedMutation.mutate({ id }),
            })}
            data={data}
            searchKey="title"
            toolbar={(table) => (
              <DataTableFilter
                table={table}
                column="status"
                options={statuses}
                title="Status"
              />
            )}
          />
        </div>
      ) : (
        <div className="flex min-h-[90vh] flex-col items-center justify-center space-y-4">
          <h2 className="text-xl font-bold md:text-2xl lg:text-4xl">
            You&apos;ve no products
          </h2>
        </div>
      )}
    </div>
  )
}

export default Page
