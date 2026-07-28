ALTER TABLE "boosting_coin" ALTER COLUMN "coin" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "vendor_coin" ALTER COLUMN "coin" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "vendor_coin_purchase" ALTER COLUMN "coin" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "vendor_coin_purchase" ALTER COLUMN "price" SET NOT NULL;