import { getSubCategoriesAction } from "@/api/categories/subcategories-action"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { subCategoriesType } from "@workspace/validators/types/categories.types"
import { toast } from "sonner"

export const useGetSubCategories = (type?: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["sub-categories", type],
    queryFn: () => getSubCategoriesAction(type),
  })
  return { data, isLoading }
}

interface UseCategoryMutationProps<TVariables> {
  mutationFn: (variables: TVariables) => Promise<unknown>
  successMessage?: string
  onSuccessClose?: () => void
}

export function useSubCategoryMutation<TVariables extends string | string[]>({
  mutationFn,
  successMessage,
  onSuccessClose,
}: UseCategoryMutationProps<TVariables>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,

    onMutate: async (categoryId) => {
      await queryClient.cancelQueries({
        queryKey: ["sub-categories"],
      })

      const previousCategories = queryClient.getQueryData<subCategoriesType[]>([
        "sub-categories",
      ])

      queryClient.setQueryData<subCategoriesType[]>(
        ["sub-categories"],
        (old = []) => old.filter((cat) => cat.id !== categoryId)
      )

      if (successMessage) {
        toast.success(successMessage)
      }

      onSuccessClose?.()

      return { previousCategories }
    },

    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["sub-categories"], context?.previousCategories)
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["sub-categories"],
      })
    },
  })
}
