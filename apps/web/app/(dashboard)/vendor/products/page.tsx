"use client"

import { InfinityScroll } from "@/components/common/products/infinity-scroll"
import { useAllProducts } from "@/hooks/products/use-products"
import { Button } from "@workspace/ui/components/button"
import { Separator } from "@workspace/ui/components/separator"
import { format } from "date-fns"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { VendorProductCard } from "./_components/vendor-product-card"

const Page = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useAllProducts({ pageSize: 10 })

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold md:text-2xl">Products (0)</h2>
        <Link href={"/vendor/products/create-product"}>
          <Button size={"lg"}>
            <PlusCircle /> Create Product
          </Button>
        </Link>
      </div>
      <Separator className="my-3" />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.map((item) => (
          <VendorProductCard key={item.id} data={item} />
        ))}
      </div>
      <InfinityScroll
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        finishText="No More"
        isManual={true}
      />
    </div>
  )
}

export default Page
