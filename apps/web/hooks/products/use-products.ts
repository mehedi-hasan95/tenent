import {
  fetchAllProductsAction,
  singleProductsAction,
} from "@/api/products/seller-products-action"
import { CACHE_ALL_PRODUCTS_KEYS } from "@/lib/query-cache"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { DEFAULT_SIZE } from "@workspace/validators/types/constants.types"
import { useMemo } from "react"

export const useGetAllProducts = ({
  pageSize = DEFAULT_SIZE,
  staleTime,
}: { seller?: string; pageSize?: number; staleTime?: number } = {}) => {
  const query = useInfiniteQuery({
    queryKey: CACHE_ALL_PRODUCTS_KEYS(pageSize),
    queryFn: ({ pageParam }) =>
      fetchAllProductsAction({ cursor: pageParam, pageSize }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    staleTime,
  })

  const data = useMemo(
    () => query.data?.pages.flatMap((page) => page.data) ?? [],
    [query.data]
  )

  return { ...query, data }
}

export const useGetSingleProduct = ({ id }: { id: string }) => {
  const { data, isPending } = useQuery({
    queryKey: ["products", id],
    queryFn: () => singleProductsAction(id),
    retry: 1,
    enabled: !!id,
    staleTime: 60 * 1000 * 5,
  })
  return { data, isPending }
}
