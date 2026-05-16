CREATE TYPE "public"."user-role" AS ENUM('USER', 'SELLER');--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'USER'::"public"."user-role";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET DATA TYPE "public"."user-role" USING "role"::"public"."user-role";