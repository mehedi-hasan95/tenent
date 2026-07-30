import { getQueryClient } from "@/lib/lib"
import { CreateProductForm } from "./_components/create-product-form"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { singleProductsAction } from "@/api/products/products-action"

interface Props {
  params: Promise<{ id: string }>
}
const Page = async ({ params }: Props) => {
  const { id } = await params
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({
    queryKey: ["products", id],
    queryFn: () => singleProductsAction(id),
  })
  return (
    <div className="flex min-h-[85vh] items-center justify-center">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CreateProductForm id={id} />
      </HydrationBoundary>
    </div>
  )
}

export default Page
