import { fetchAllProducts } from "@/api/products/products-action"
import { useInfiniteQuery } from "@tanstack/react-query"
import { DEFAULT_SIZE } from "@workspace/validators/types/constants.types"
import { useEffect, useMemo, useRef, useState } from "react"

export const useInterceptionObserver = (options?: IntersectionObserverInit) => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const targetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry) {
        setIsIntersecting(entry.isIntersecting)
      }
    }, options)

    if (targetRef.current) {
      observer.observe(targetRef.current)
    }

    return () => observer.disconnect()
  }, [options])
  return { targetRef, isIntersecting }
}

type useAllProductsParams = {
  seller?: string
  pageSize?: number
}
export const useAllProducts = ({
  seller,
  pageSize = DEFAULT_SIZE,
}: useAllProductsParams = {}) => {
  const query = useInfiniteQuery({
    queryKey: ["products", seller, pageSize],
    queryFn: ({ pageParam }) =>
      fetchAllProducts({ seller, cursor: pageParam, pageSize }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
  })

  const data = useMemo(
    () => query.data?.pages.flatMap((page) => page.data) ?? [],
    [query.data]
  )

  return { ...query, data }
}
