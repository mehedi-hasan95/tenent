import { getCategoriesAction } from "@/api/categories/categories-action"
import { useQuery } from "@tanstack/react-query"

export const useGetCategories = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesAction,
    staleTime: 60 * 1000 * 5,
  })
  return { data, isLoading }
}
