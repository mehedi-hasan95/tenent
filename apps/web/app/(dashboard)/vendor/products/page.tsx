"use client"

import { useState } from "react"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"

import { InfinityScroll } from "@/components/common/products/infinity-scroll"
import { TrashedModal } from "@/components/common/trashed-modal"
import { VendorProductCard } from "./_components/vendor-product-card"

import { useGetAllProducts } from "@/hooks/products/use-products"
import { useGetSession } from "@/hooks/auth/use-auth"

import { trashedProductAction } from "@/api/products/products-action"

import { Button } from "@workspace/ui/components/button"
import { Separator } from "@workspace/ui/components/separator"
import { PRODUCT_TYPE } from "@workspace/validators/types/product.types"

// Type of one page returned from your API
type ProductsPage = {
  data: PRODUCT_TYPE[]
  nextCursor?: string | null
}

const Page = () => {
  const { user } = useGetSession()

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetAllProducts({
      pageSize: 10,
      seller: user?.email,
      staleTime: 5 * 1000 * 60,
    })

  const [trashedModalOpen, setTrashedModalOpen] = useState(false)
  const [deletingProduct, setDeletingProduct] = useState<string | null>(null)

  const queryClient = useQueryClient()

  const handleTrashedModal = () => {
    setTrashedModalOpen(false)
    setDeletingProduct(null)
  }

  const handleTrashedProduct = (id: string) => {
    setDeletingProduct(id)
    setTrashedModalOpen(true)
  }

  const trashedMutation = useMutation({
    mutationFn: trashedProductAction,

    onMutate: async ({ id }: { id: string }) => {
      await queryClient.cancelQueries({
        queryKey: ["products", user?.email, 10],
      })

      const previousProducts = queryClient.getQueryData<
        InfiniteData<ProductsPage>
      >(["products", user?.email, 10])

      queryClient.setQueryData<InfiniteData<ProductsPage>>(
        ["products", user?.email, 10],
        (old) => {
          if (!old) return old

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.filter(
                (product: PRODUCT_TYPE) => product.id !== id
              ),
            })),
          }
        }
      )

      setTrashedModalOpen(false)

      return { previousProducts }
    },

    onError: (_error, _variables, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(
          ["products", user?.email, 10],
          context.previousProducts
        )
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["products", user?.email, 10],
      })
    },
  })

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold md:text-2xl">
          Products ({data.length})
        </h2>

        <Link href="/vendor/products/create-product">
          <Button size="lg">
            <PlusCircle />
            Create Product
          </Button>
        </Link>
      </div>

      <Separator className="my-3" />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.map((item) => (
          <VendorProductCard
            key={item.id}
            data={item}
            onDelete={handleTrashedProduct}
          />
        ))}
      </div>

      <TrashedModal
        open={trashedModalOpen}
        onOpenChange={handleTrashedModal}
        onSubmit={() =>
          deletingProduct &&
          trashedMutation.mutate({
            id: deletingProduct,
          })
        }
        loading={trashedMutation.isPending}
        title="Do you want to delete this product?"
        description="If you delete this product will be stored in trash for 30 days."
      />

      <InfinityScroll
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        finishText="No More"
        isManual
      />
    </div>
  )
}

export default Page
