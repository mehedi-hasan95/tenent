ALTER TABLE "order_items" ALTER COLUMN "used_coupon" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "used_coupon" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "used_coupon" DROP NOT NULL;