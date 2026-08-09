"use client"

import { cn } from "@workspace/ui/lib/utils"
import { Star } from "lucide-react"
import { useState } from "react"

interface StarRatingProps {
  rating: number
  onRatingChange: (rating: number) => void
  disabled: boolean
}

export const StarRatingForm = ({
  rating = 0,
  onRatingChange,
  disabled,
}: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState(0)

  return (
    <div
      className={cn(
        "flex space-x-1",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= (hoverRating || rating)

        return (
          <button
            key={star}
            type="button"
            className="focus:outline-none"
            onClick={() => onRatingChange(star === rating ? 0 : star)}
            onMouseEnter={() => !disabled && setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            disabled={disabled}
          >
            <Star
              className={cn(
                "h-8 w-8 transition-all",
                disabled ? "cursor-not-allowed" : "cursor-pointer"
              )}
              style={{
                fill: isActive ? "#fbbf24" : "none", // amber-400
                stroke: "#fbbf24",
              }}
            />
            <span className="sr-only">{star} stars</span>
          </button>
        )
      })}
    </div>
  )
}
