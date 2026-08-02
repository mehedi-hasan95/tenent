import {
  boostedProductsAction,
  fetchAllProductsAction,
  singleProductsAction,
} from "@/api/products/products-action"
import { sellerAllProductsAction } from "@/api/products/seller-products-action"
import {
  CACHE_ALL_PRODUCTS,
  CACHE_SELLER_PRODUCTS_KEYS,
} from "@/lib/query-cache"
import { useProductFilters } from "@/nuqs/nuqs-client"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import {
  DEFAULT_SIZE,
  sortValues,
} from "@workspace/validators/types/constants.types"
import { PRODUCT_TYPE } from "@workspace/validators/types/product.types"
import { useMemo } from "react"

export const useGetAllProducts = ({
  pageSize = DEFAULT_SIZE,
  staleTime,
}: { seller?: string; pageSize?: number; staleTime?: number } = {}) => {
  const [filters] = useProductFilters()
  const search = filters.search ?? ""
  const minPrice = filters.minPrice ? Number(filters.minPrice) : undefined
  const maxPrice = filters.maxPrice ? Number(filters.maxPrice) : undefined
  const cats =
    typeof filters.cats === "string"
      ? (filters.cats as string).split(",")
      : Array.isArray(filters.cats)
        ? filters.cats
        : undefined
  const sort = filters.sort as (typeof sortValues)[number] | undefined
  const query = useInfiniteQuery({
    queryKey: CACHE_ALL_PRODUCTS(pageSize, sort, cats, minPrice, maxPrice),
    queryFn: ({ pageParam }) =>
      fetchAllProductsAction({
        cursor: pageParam,
        pageSize,
        search,
        minPrice,
        maxPrice,
        cats,
        sort,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    staleTime,
  })

  const data: {
    products: PRODUCT_TYPE
    boost: number
    avgRating: number
    ratingCount: number
  }[] = useMemo(
    () => query.data?.pages.flatMap((page) => page.data) ?? [],
    [query.data]
  )

  return { ...query, data }
}

export const useGetSingleProduct = ({ id }: { id: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["products", id],
    queryFn: () => singleProductsAction(id),
    retry: 1,
    enabled: !!id,
    staleTime: 60 * 1000 * 5,
  })
  return { data, isLoading }
}

export const useGetVendorAllProducts = () => {
  const { data, isLoading } = useQuery({
    queryKey: CACHE_SELLER_PRODUCTS_KEYS,
    queryFn: sellerAllProductsAction,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  })
  return { data, isLoading }
}

export const useGetBoostedProducts = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ["boosted-products"],
    queryFn: boostedProductsAction,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })
  return { data, isLoading }
}
