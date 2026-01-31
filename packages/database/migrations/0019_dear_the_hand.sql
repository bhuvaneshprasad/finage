DROP INDEX "mf_nav_unique_idx";--> statement-breakpoint
ALTER TABLE "mf_nav" ADD COLUMN "cagr_1w" numeric;--> statement-breakpoint
ALTER TABLE "mf_nav" ADD COLUMN "cagr_1m" numeric;--> statement-breakpoint
ALTER TABLE "mf_nav" ADD COLUMN "cagr_3m" numeric;--> statement-breakpoint
ALTER TABLE "mf_nav" ADD COLUMN "cagr_6m" numeric;--> statement-breakpoint
ALTER TABLE "mf_nav" ADD COLUMN "cagr_1y" numeric;--> statement-breakpoint
ALTER TABLE "mf_nav" ADD COLUMN "cagr_2y" numeric;--> statement-breakpoint
ALTER TABLE "mf_nav" ADD COLUMN "cagr_3y" numeric;--> statement-breakpoint
ALTER TABLE "mf_nav" ADD COLUMN "cagr_5y" numeric;--> statement-breakpoint
ALTER TABLE "mf_nav" ADD COLUMN "cagr_7y" numeric;--> statement-breakpoint
ALTER TABLE "mf_nav" ADD COLUMN "cagr_10y" numeric;--> statement-breakpoint
ALTER TABLE "mf_nav" ADD COLUMN "cagr_15y" numeric;--> statement-breakpoint
CREATE UNIQUE INDEX "mf_nav_unique_idx" ON "mf_nav" USING btree ("mf_code","nav_date");