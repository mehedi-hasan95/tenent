import { getSessionAction, signoutAction } from "@/api/auth/auth-server-action"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export const useGetSession = () => {
  const { data } = useQuery({
    queryKey: ["session"],
    queryFn: getSessionAction,
    staleTime: 1000 * 60 * 20,
  })
  return { user: data?.user }
}

export const useSignout = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const logoutMutation = useMutation({
    mutationFn: signoutAction,
    onSuccess: () => {
      toast.success("Success", { description: "Logout Successfully" })
      queryClient.removeQueries({ queryKey: ["session"] })
      router.refresh()
    },
    onError: () => {
      toast.error("Something went wrong")
    },
  })
  return logoutMutation
}
