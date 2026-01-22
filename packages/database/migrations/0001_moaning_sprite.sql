ALTER TABLE "amc" ADD COLUMN "amc_logo_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "amc" ADD CONSTRAINT "amc_amc_name_unique" UNIQUE("amc_name");--> statement-breakpoint
ALTER TABLE "amc" ADD CONSTRAINT "amc_amc_logo_name_unique" UNIQUE("amc_logo_name");