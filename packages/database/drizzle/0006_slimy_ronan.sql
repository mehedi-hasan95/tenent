CREATE TABLE "vendor_coin" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"coin" real,
	"email" text NOT NULL,
	"updated_at" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vendor_coin_purchase" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"coin" real,
	"price" real,
	"email" text NOT NULL,
	"updated_at" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "boosting_coin" ALTER COLUMN "coin" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "vendor_coin" ADD CONSTRAINT "vendor_coin_email_user_email_fk" FOREIGN KEY ("email") REFERENCES "public"."user"("email") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_coin_purchase" ADD CONSTRAINT "vendor_coin_purchase_email_user_email_fk" FOREIGN KEY ("email") REFERENCES "public"."user"("email") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "vendor_email" ON "vendor_coin" USING btree ("email");--> statement-breakpoint
CREATE INDEX "vendor_purchase_email" ON "vendor_coin_purchase" USING btree ("email");