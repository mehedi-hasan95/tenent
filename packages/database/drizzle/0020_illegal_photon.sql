ALTER TABLE "coupons" DROP CONSTRAINT "active_coupon_has_one_discount";--> statement-breakpoint
ALTER TABLE "coupons" ALTER COLUMN "code" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "coupons" ADD CONSTRAINT "active_coupon_requires_code_and_one_discount" CHECK (NOT "coupons"."is_active" OR
    (
      "coupons"."code" IS NOT NULL AND
      "coupons"."code" != '' AND
      (
        ("coupons"."discount_percent" IS NOT NULL AND "coupons"."flat_discount" IS NULL) OR
        ("coupons"."discount_percent" IS NULL AND "coupons"."flat_discount" IS NOT NULL)
      )
    ));