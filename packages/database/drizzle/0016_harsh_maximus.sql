DROP INDEX "products_created_at_idx";--> statement-breakpoint
ALTER TABLE "product_boost" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "vendor_coin" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "vendor_coin_purchase" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "sub-categories" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "ratings" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");--> statement-breakpoint
ALTER TABLE "product_boost" DROP COLUMN "created_At";--> statement-breakpoint
ALTER TABLE "vendor_coin" DROP COLUMN "created_At";--> statement-breakpoint
ALTER TABLE "vendor_coin_purchase" DROP COLUMN "created_At";--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN "created_At";--> statement-breakpoint
ALTER TABLE "sub-categories" DROP COLUMN "created_At";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "created_At";--> statement-breakpoint
ALTER TABLE "order_items" DROP COLUMN "created_At";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "created_At";--> statement-breakpoint
ALTER TABLE "ratings" DROP COLUMN "created_At";