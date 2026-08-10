import { getQueryClient } from "@/lib/lib"
import { RatingPage } from "./_components/ratting-page"
import { userAllRatingsAction } from "@/api/reports/user/user-report-action"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

const Page = async () => {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({
    queryKey: ["user-ratings"],
    queryFn: userAllRatingsAction,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RatingPage />
    </HydrationBoundary>
  )
}

export default Page
