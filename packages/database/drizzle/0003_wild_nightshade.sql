CREATE TYPE "public"."product_status" AS ENUM('draft', 'active', 'archived');--> statement-breakpoint
CREATE TYPE "public"."product_type" AS ENUM('physical', 'digital', 'service');--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"short_description" text NOT NULL,
	"base_price" real NOT NULL,
	"sale_price" real NOT NULL,
	"stock" integer NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"weight" real,
	"type" "product_type" DEFAULT 'physical' NOT NULL,
	"status" "product_status" DEFAULT 'draft' NOT NULL,
	"images" text[] DEFAULT '{}' NOT NULL,
	"category_slug" text NOT NULL,
	"sub_category_slug" text NOT NULL,
	"color" text[] DEFAULT '{}' NOT NULL,
	"specification" jsonb,
	"description" text NOT NULL,
	"cash_on_delivery" boolean DEFAULT false NOT NULL,
	"coupon" text,
	"sizes" text[] DEFAULT '{}' NOT NULL,
	"user_email" text NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_slug_categories_slug_fk" FOREIGN KEY ("category_slug") REFERENCES "public"."categories"("slug") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_sub_category_slug_sub-categories_slug_fk" FOREIGN KEY ("sub_category_slug") REFERENCES "public"."sub-categories"("slug") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_user_email_user_email_fk" FOREIGN KEY ("user_email") REFERENCES "public"."user"("email") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "products_id_idx" ON "products" USING btree ("id");