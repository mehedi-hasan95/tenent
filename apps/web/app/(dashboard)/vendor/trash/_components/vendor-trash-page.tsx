"use client"

import { Trash } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { allTrashedProductAction } from "@/api/products/products-action"
import { ProductsTrashPage } from "./products-trash-page"

export const VendorTrashPage = () => {
  const { data } = useQuery({
    queryKey: ["trashed-products"],
    queryFn: allTrashedProductAction,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  })
  return (
    <>
      {!data?.length ? (
        <div className="flex min-h-[90vh] flex-col items-center justify-center space-y-4">
          <Trash className="size-8 md:size-12 lg:size-16" />
          <h2 className="text-xl font-bold md:text-2xl lg:text-4xl">
            Trash is Empty
          </h2>
        </div>
      ) : (
        <div className="space-y-4">
          <ProductsTrashPage data={data} />
        </div>
      )}
    </>
  )
}
