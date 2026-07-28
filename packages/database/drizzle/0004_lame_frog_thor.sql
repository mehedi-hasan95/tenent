ALTER TABLE "products" ALTER COLUMN "tags" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "tags" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "color" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "color" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "sizes" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "sizes" DROP NOT NULL;