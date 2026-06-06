CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sub-categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"categorySlug" text NOT NULL,
	CONSTRAINT "sub-categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "sub-categories" ADD CONSTRAINT "sub-categories_categorySlug_categories_slug_fk" FOREIGN KEY ("categorySlug") REFERENCES "public"."categories"("slug") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "category_slug_ids" ON "categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "subCategory_slug_ids" ON "sub-categories" USING btree ("slug");