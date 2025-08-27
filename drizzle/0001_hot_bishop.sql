ALTER TABLE "users" ALTER COLUMN "recovery_email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_active" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "age";