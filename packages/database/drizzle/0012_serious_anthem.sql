ALTER TABLE "product_boost" DROP CONSTRAINT "product_boost_productId_products_id_fk";
--> statement-breakpoint
ALTER TABLE "product_boost" DROP CONSTRAINT "product_boost_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "sub-categories" DROP CONSTRAINT "sub-categories_categorySlug_categories_slug_fk";
--> statement-breakpoint
DROP INDEX "product_boosts_product_idx";--> statement-breakpoint
DROP INDEX "product_boosts_user_idx";--> statement-breakpoint
DROP INDEX "product_boosts_user_product_unique";--> statement-breakpoint
ALTER TABLE "boosting_coin" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "product_boost" ADD COLUMN "product_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "product_boost" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "product_boost" ADD COLUMN "created_At" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "product_boost" ADD COLUMN "end_at" timestamp;--> statement-breakpoint
ALTER TABLE "vendor_coin" ADD COLUMN "created_At" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "vendor_coin_purchase" ADD COLUMN "created_At" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "created_At" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "sub-categories" ADD COLUMN "created_At" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "sub-categories" ADD COLUMN "category_slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "created_At" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "product_boost" ADD CONSTRAINT "product_boost_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_boost" ADD CONSTRAINT "product_boost_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sub-categories" ADD CONSTRAINT "sub-categories_category_slug_categories_slug_fk" FOREIGN KEY ("category_slug") REFERENCES "public"."categories"("slug") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "product_boosts_product_idx" ON "product_boost" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_boosts_user_idx" ON "product_boost" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "product_boosts_user_product_unique" ON "product_boost" USING btree ("product_id","end_at");--> statement-breakpoint
ALTER TABLE "boosting_coin" DROP COLUMN "createdAt";--> statement-breakpoint
ALTER TABLE "product_boost" DROP COLUMN "productId";--> statement-breakpoint
ALTER TABLE "product_boost" DROP COLUMN "userId";--> statement-breakpoint
ALTER TABLE "product_boost" DROP COLUMN "createdAt";--> statement-breakpoint
ALTER TABLE "product_boost" DROP COLUMN "endAt";--> statement-breakpoint
ALTER TABLE "vendor_coin" DROP COLUMN "createdAt";--> statement-breakpoint
ALTER TABLE "vendor_coin_purchase" DROP COLUMN "createdAt";--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN "createdAt";--> statement-breakpoint
ALTER TABLE "sub-categories" DROP COLUMN "createdAt";--> statement-breakpoint
ALTER TABLE "sub-categories" DROP COLUMN "categorySlug";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "createdAt";