CREATE TYPE "public"."order_enum" AS ENUM('PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED');--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "status" SET DATA TYPE "public"."order_enum" USING "status"::text::"public"."order_enum";--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "status" SET DEFAULT 'PROCESSING';--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "payment_intent" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "country" DROP NOT NULL;--> statement-breakpoint
DROP TYPE "public"."order_status";