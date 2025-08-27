CREATE TYPE "public"."user_roles" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"age" integer NOT NULL,
	"email" varchar(255) NOT NULL,
	"roles" "user_roles"[] DEFAULT '{"user"}' NOT NULL,
	"recovery_email" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"is_verified" boolean DEFAULT false,
	"email_verification_token" varchar(255),
	"email_verified_at" timestamp,
	"email_verification_sent_at" timestamp,
	"email_verification_token_expires_at" timestamp,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_recovery_email_unique" UNIQUE("recovery_email")
);
