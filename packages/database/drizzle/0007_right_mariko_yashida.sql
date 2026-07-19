DROP INDEX "vendor_email";--> statement-breakpoint
CREATE UNIQUE INDEX "vendor_email" ON "vendor_coin" USING btree ("email");