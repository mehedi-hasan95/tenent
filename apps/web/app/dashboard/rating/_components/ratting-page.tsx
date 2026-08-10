"use client"

import { userAllRatingsAction } from "@/api/reports/user/user-report-action"
import { StarRating } from "@/components/common/products/star-rating"
import { useQuery } from "@tanstack/react-query"
import { Separator } from "@workspace/ui/components/separator"
import { format } from "date-fns"
import Image from "next/image"

export const RatingPage = () => {
  const { data } = useQuery({
    queryKey: ["user-ratings"],
    queryFn: userAllRatingsAction,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })
  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-extrabold md:text-3xl">
        Your Ratings & Reviews
      </h2>
      <Separator />
      <div className="grid grid-cols-3 gap-5">
        {data?.map((item) => (
          <div
            key={item.ratings.id}
            className="flex gap-4 rounded-2xl border-2 bg-card p-5"
          >
            <Image
              src={item.product?.image[0] as string}
              alt={item.product?.title}
              height={120}
              width={120}
            />
            <div className="flex-1">
              <div className="space-y-2">
                <h2 className="text-xl font-bold">{item.product.title}</h2>
                <StarRating rating={item.ratings.rating} />
                <blockquote>&quot;{item.ratings.reviews}&quot;</blockquote>
              </div>
              <Separator className="mt-1 mb-2" />
              <div className="text-right text-sm font-light">
                {format(item.ratings.createdAt, "MMM d, yyyy")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
