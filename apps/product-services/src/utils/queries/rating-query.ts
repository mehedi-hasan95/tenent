import { db, gt, sql } from "@workspace/db"
import { productBoost } from "@workspace/db/schema/boosting.schema"
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

export const boostingSubquery = () => {
  return db
    .select({
      productId: productBoost.productId,
      boostRate:
        sql<number>`max(${productBoost.coins} / (extract(epoch from (${productBoost.endAt} - ${productBoost.createdAt})) / 86400))`.as(
          "boost_rate"
        ),
    })
    .from(productBoost)
    .where(gt(productBoost.endAt, sql`now()`))
    .groupBy(productBoost.productId)
    .as("boost_sq")
}
