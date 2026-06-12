import { getSubCategoriesAction } from "@/api/categories/subcategories-action"
import { useQuery } from "@tanstack/react-query"

export const useGetSubCategories = (type?: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["sub-categories", type],
    queryFn: () => getSubCategoriesAction(type),
  })
  return { data, isLoading }
}
