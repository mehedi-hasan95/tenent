import { getQueryClient } from "@/lib/get-query-client"
import { ProductIdPage } from "./_components/product-id-page"
import {
  relatedProductAction,
  singleProductsAction,
} from "@/api/products/products-action"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

interface Props {
  params: Promise<{ id: string }>
}
const Page = async ({ params }: Props) => {
  const { id } = await params
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({
    queryKey: ["products", id],
    queryFn: () => singleProductsAction(id),
    retry: 1,
    staleTime: 60 * 1000 * 5,
  })
  await queryClient.prefetchQuery({
    queryKey: ["related-products-and-others", id],
    queryFn: () => relatedProductAction({ id }),
    retry: 1,
    staleTime: 60 * 1000 * 5,
  })
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductIdPage id={id} />
    </HydrationBoundary>
  )
}

export default Page
