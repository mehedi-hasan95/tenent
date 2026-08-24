"use client"

import { StarRating } from "@/components/common/products/star-rating"
import { format } from "date-fns"
import { Star } from "lucide-react"

interface Props {
  rating: { rating: number; count: number; percentage: number }[]
  review: {
    reviews: string | null
    name: string
    img: string | null
    createdAt: Date
    rating: number
  }[]
  total: number
  avgRating: number
}
export default function ReviewsSection({
  avgRating,
  rating,
  review,
  total,
}: Props) {
  return (
    <section className="mt-16 space-y-8 border-t border-border pt-12">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-foreground">
          Customer Reviews
        </h2>
        <p className="text-muted-foreground">
          {total} verified reviews from real customers
        </p>
      </div>

      {/* Review Summary */}
      <div className="space-y-4 rounded-lg bg-muted/50 p-6">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-foreground">
              {avgRating}
            </div>
            <div className="mt-1 flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < 4 ? "fill-amber-400 text-amber-400" : i === 4 ? "fill-amber-400/50 text-amber-400/50" : "text-muted-foreground"}`}
                />
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {total} reviews
            </p>
          </div>
          <div className="flex-1 space-y-2">
            {rating.map((item) => (
              <div key={item.rating} className="flex items-center gap-2">
                <span className="w-8 text-sm text-muted-foreground">
                  {item.rating}★
                </span>

                <div className="h-2 flex-1 overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full bg-amber-400"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>

                <span className="w-12 text-right text-sm text-muted-foreground">
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {review.map((review, idx) => (
          <div key={idx} className="border-b border-border pb-6 last:border-0">
            <div className="mb-2 flex items-start justify-between">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="font-semibold text-foreground">
                    {review.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {format(review.createdAt, "MMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <StarRating rating={review.rating} />
                </div>
              </div>
            </div>

            <p className="mb-3 leading-relaxed text-muted-foreground">
              {review.reviews}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
