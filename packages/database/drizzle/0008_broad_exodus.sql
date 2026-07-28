CREATE TABLE "product_boost" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"productId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"coins" real NOT NULL,
	"updated_at" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"endAt" timestamp
);
--> statement-breakpoint
ALTER TABLE "product_boost" ADD CONSTRAINT "product_boost_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_boost" ADD CONSTRAINT "product_boost_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "product_boosts_product_idx" ON "product_boost" USING btree ("productId");--> statement-breakpoint
CREATE INDEX "product_boosts_user_idx" ON "product_boost" USING btree ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX "product_boosts_user_product_unique" ON "product_boost" USING btree ("productId","endAt");