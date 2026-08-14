CREATE TYPE "public"."order_status" AS ENUM('PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED');--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"price" real NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"size" varchar(50),
	"color" varchar(50),
	"used_coupon" boolean DEFAULT false NOT NULL,
	"status" "order_status" DEFAULT 'PROCESSING' NOT NULL,
	"order_id" uuid NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_At" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"total_price" real NOT NULL,
	"is_paid" boolean DEFAULT false NOT NULL,
	"payment_intent" varchar(255) NOT NULL,
	"line1" varchar(255),
	"postal_code" varchar(50),
	"city" varchar(100),
	"state" varchar(100),
	"phone" varchar(30),
	"country" varchar(100) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_At" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ratings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"order_id" uuid NOT NULL,
	"email" varchar NOT NULL,
	"rating" integer NOT NULL,
	"reviews" varchar(400),
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_At" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP INDEX "products_id_idx";--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_email_user_email_fk" FOREIGN KEY ("email") REFERENCES "public"."user"("email") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_email_user_email_fk" FOREIGN KEY ("email") REFERENCES "public"."user"("email") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "order_items_order_id_idx" ON "order_items" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "order_items_product_id_idx" ON "order_items" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "order_items_status_idx" ON "order_items" USING btree ("status");--> statement-breakpoint
CREATE INDEX "order_user_email_idx" ON "orders" USING btree ("email");--> statement-breakpoint
CREATE INDEX "ratings_product_id_idx" ON "ratings" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "ratings_order_id_idx" ON "ratings" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "ratings_email_idx" ON "ratings" USING btree ("email");--> statement-breakpoint
CREATE INDEX "products_category_idx" ON "products" USING btree ("category_slug");--> statement-breakpoint
CREATE INDEX "products_subcategory_idx" ON "products" USING btree ("sub_category_slug");--> statement-breakpoint
CREATE INDEX "products_status_idx" ON "products" USING btree ("status");--> statement-breakpoint
CREATE INDEX "products_category_status_idx" ON "products" USING btree ("category_slug","status");--> statement-breakpoint
CREATE INDEX "products_user_email_idx" ON "products" USING btree ("user_email");--> statement-breakpoint
CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_At");--> statement-breakpoint
CREATE INDEX "products_sale_price_idx" ON "products" USING btree ("sale_price");