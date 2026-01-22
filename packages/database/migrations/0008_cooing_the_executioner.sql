ALTER TABLE "mf_schemes" DROP CONSTRAINT "mf_schemes_asset_type_code_asset_type_asset_type_code_fk";
--> statement-breakpoint
CREATE UNIQUE INDEX "unique_mf_schemes_key" ON "mf_schemes" USING btree ("isin","scheme_name","amc_code","category_code","base_currency","domicile_country","benchmark_code");--> statement-breakpoint
ALTER TABLE "mf_schemes" DROP COLUMN "asset_type_code";