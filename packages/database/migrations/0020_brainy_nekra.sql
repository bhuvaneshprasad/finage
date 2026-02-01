CREATE TABLE "mf_scheme_groups" (
	"scheme_group_id" text PRIMARY KEY NOT NULL,
	"ext_scheme_id" integer,
	"amc_code" integer,
	"scheme_name" text,
	"scheme_objective" text,
	"scheme_type" text,
	"launch_date" text,
	"scheme_load" text,
	"min_invest_amt" text
);
--> statement-breakpoint
DROP INDEX "unique_isin_amc_scheme_category_idx";--> statement-breakpoint
DROP INDEX "isin_amc_idx";--> statement-breakpoint
ALTER TABLE "mf_schemes" ADD COLUMN "scheme_group_id" text;--> statement-breakpoint
ALTER TABLE "mf_scheme_groups" ADD CONSTRAINT "mf_scheme_groups_amc_code_amc_amc_code_fk" FOREIGN KEY ("amc_code") REFERENCES "public"."amc"("amc_code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_id_amc_idx" ON "mf_scheme_groups" USING btree ("ext_scheme_id","amc_code");--> statement-breakpoint
ALTER TABLE "mf_schemes" ADD CONSTRAINT "mf_schemes_scheme_group_id_mf_scheme_groups_scheme_group_id_fk" FOREIGN KEY ("scheme_group_id") REFERENCES "public"."mf_scheme_groups"("scheme_group_id") ON DELETE no action ON UPDATE no action;