CREATE TABLE "coupons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(50) NOT NULL,
	"discount_percent" integer,
	"flat_discount" real,
	"is_active" boolean DEFAULT true NOT NULL,
	"expires_at" timestamp,
	"max_redemptions" integer,
	"times_redeemed" integer DEFAULT 0 NOT NULL,
	"min_order_amount" real,
	"product_id" uuid NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "coupons_product_id_unique" UNIQUE("product_id"),
	CONSTRAINT "active_coupon_has_one_discount" CHECK (NOT "coupons"."is_active" OR
      ("coupons"."discount_percent" IS NOT NULL AND "coupons"."flat_discount" IS NULL) OR
      ("coupons"."discount_percent" IS NULL AND "coupons"."flat_discount" IS NOT NULL))
);
--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "stock" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "total_sale" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "coupon_product_code_idx" ON "coupons" USING btree ("product_id","code");--> statement-breakpoint
CREATE INDEX "coupon_code_idx" ON "coupons" USING btree ("code");