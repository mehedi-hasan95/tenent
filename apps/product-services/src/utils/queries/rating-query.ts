import { db, sql } from "@workspace/db"
import { ratings } from "@workspace/db/schema/order.schema"

export function ratingSubquery() {
  return db
    .select({
      productId: ratings.productId,
      avgRating: sql<number>`avg(${ratings.rating})`.as("avg_rating"),
      ratingCount: sql<number>`count(*)`.as("rating_count"),
    })
    .from(ratings)
    .groupBy(ratings.productId)
    .as("rating_sq")
}

type RatingSq = ReturnType<typeof ratingSubquery>

export function ratingColumns(sq: RatingSq) {
  return {
    avgRating: sql<number>`coalesce(${sq.avgRating}, 0)::float`.as("avgRating"),
    ratingCount: sql<number>`coalesce(${sq.ratingCount}, 0)::int`.as(
      "ratingCount"
    ),
  }
}
