CREATE TABLE "boosting_coin" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"coin" integer,
	"is_active" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
