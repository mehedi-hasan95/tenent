ALTER TABLE "user" ADD COLUMN "stripeCustomerId" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "stripeAccountId" text;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_stripeCustomerId_unique" UNIQUE("stripeCustomerId");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_stripeAccountId_unique" UNIQUE("stripeAccountId");