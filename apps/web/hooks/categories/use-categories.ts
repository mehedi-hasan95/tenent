import {
  getCategoriesAction,
  getCategoryAction,
} from "@/api/categories/categories-action"
import { useQuery } from "@tanstack/react-query"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { categoriesType } from "@workspace/validators/types/categories.types"
import { toast } from "sonner"
export const useGetCategories = (type?: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["categories", type],
    queryFn: () => getCategoriesAction(type),
    staleTime: 60 * 1000 * 5,
  })
  return { data, isLoading }
}

export const useGetCategory = (slug?: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["categories", slug],
    queryFn: () => getCategoryAction(slug!),
    enabled: !!slug,
  })
  return { data, isLoading }
}

interface UseCategoryMutationProps<TVariables> {
  mutationFn: (variables: TVariables) => Promise<unknown>
  successMessage?: string
  onSuccessClose?: () => void
}

export function useCategoryMutation<TVariables extends string | string[]>({
  mutationFn,
  successMessage,
  onSuccessClose,
}: UseCategoryMutationProps<TVariables>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,

    onMutate: async (categoryId) => {
      await queryClient.cancelQueries({
        queryKey: ["categories"],
      })

      const previousCategories = queryClient.getQueryData<categoriesType[]>([
        "categories",
      ])

      queryClient.setQueryData<categoriesType[]>(["categories"], (old = []) =>
        old.filter((cat) => cat.id !== categoryId)
      )

      if (successMessage) {
        toast.success(successMessage)
      }

      onSuccessClose?.()

      return { previousCategories }
    },

    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["categories"], context?.previousCategories)
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      })
    },
  })
}
