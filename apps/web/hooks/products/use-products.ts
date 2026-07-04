import {
  fetchAllProductsAction,
  singleProductsAction,
} from "@/api/products/products-action"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { DEFAULT_SIZE } from "@workspace/validators/types/constants.types"
import { useMemo } from "react"

export const useGetAllProducts = ({
  seller,
  pageSize = DEFAULT_SIZE,
  staleTime,
}: { seller?: string; pageSize?: number; staleTime?: number } = {}) => {
  const query = useInfiniteQuery({
    queryKey: ["products", seller, pageSize],
    queryFn: ({ pageParam }) =>
      fetchAllProductsAction({ seller, cursor: pageParam, pageSize }),
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
