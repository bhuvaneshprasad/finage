CREATE TABLE "amc" (
	"amc_code" smallint PRIMARY KEY NOT NULL,
	"amc_name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "asset_type" (
	"asset_type_code" smallint PRIMARY KEY NOT NULL,
	"asset_type_name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "benchmark" (
	"benchmark_code" integer PRIMARY KEY NOT NULL,
	"benchmark_name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "country" (
	"country_code" char PRIMARY KEY NOT NULL,
	"country_name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "currency" (
	"currency_code" char PRIMARY KEY NOT NULL,
	"currency_name" text
);
--> statement-breakpoint
CREATE TABLE "fund_managers" (
	"fund_managers_id" integer PRIMARY KEY NOT NULL,
	"fund_manager_name" text NOT NULL,
	"gender" char
);
--> statement-breakpoint
CREATE TABLE "mf_holdings" (
	"id" text PRIMARY KEY NOT NULL,
	"holding_type" smallint,
	"security_code" integer,
	"mf_holding_as_on_code" integer,
	"weight" numeric NOT NULL,
	"no_of_units" numeric,
	"market_value" numeric,
	"maturity_date" date,
	"coupon" numeric
);
--> statement-breakpoint
CREATE TABLE "mf_holdig_period" (
	"mf_holding_period_code" integer PRIMARY KEY NOT NULL,
	"mf_holding_as_on" date NOT NULL,
	CONSTRAINT "mf_holdig_period_mf_holding_as_on_unique" UNIQUE("mf_holding_as_on")
);
--> statement-breakpoint
CREATE TABLE "mf_nav" (
	"mf_code" text,
	"nav_date" date NOT NULL,
	"nav" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mf_scheme_fund_managers" (
	"mf_code" text,
	"fund_manager_id" integer,
	"start_date" date NOT NULL,
	"end_date" date,
	"is_current" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mf_schemes" (
	"mf_code" text PRIMARY KEY NOT NULL,
	"isin" char NOT NULL,
	"scheme_name" text NOT NULL,
	"amc_code" integer NOT NULL,
	"asset_type_code" smallint NOT NULL,
	"base_currency" char,
	"domicile_country" char,
	"inception_date" date,
	"benchmark_code" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sector" (
	"sector_id" integer PRIMARY KEY NOT NULL,
	"sector_name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "security" (
	"security_code" integer PRIMARY KEY NOT NULL,
	"isin" char NOT NULL,
	"ticker" char,
	"security_name" text NOT NULL,
	"security_type" smallint,
	"sector_id" integer,
	"country_code" char,
	"currency_code" char
);
--> statement-breakpoint
ALTER TABLE "mf_holdings" ADD CONSTRAINT "mf_holdings_holding_type_asset_type_asset_type_code_fk" FOREIGN KEY ("holding_type") REFERENCES "public"."asset_type"("asset_type_code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mf_holdings" ADD CONSTRAINT "mf_holdings_security_code_security_security_code_fk" FOREIGN KEY ("security_code") REFERENCES "public"."security"("security_code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mf_holdings" ADD CONSTRAINT "mf_holdings_mf_holding_as_on_code_mf_holdig_period_mf_holding_period_code_fk" FOREIGN KEY ("mf_holding_as_on_code") REFERENCES "public"."mf_holdig_period"("mf_holding_period_code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mf_nav" ADD CONSTRAINT "mf_nav_mf_code_mf_schemes_mf_code_fk" FOREIGN KEY ("mf_code") REFERENCES "public"."mf_schemes"("mf_code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mf_scheme_fund_managers" ADD CONSTRAINT "mf_scheme_fund_managers_mf_code_mf_schemes_mf_code_fk" FOREIGN KEY ("mf_code") REFERENCES "public"."mf_schemes"("mf_code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mf_scheme_fund_managers" ADD CONSTRAINT "mf_scheme_fund_managers_fund_manager_id_fund_managers_fund_managers_id_fk" FOREIGN KEY ("fund_manager_id") REFERENCES "public"."fund_managers"("fund_managers_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mf_schemes" ADD CONSTRAINT "mf_schemes_amc_code_amc_amc_code_fk" FOREIGN KEY ("amc_code") REFERENCES "public"."amc"("amc_code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mf_schemes" ADD CONSTRAINT "mf_schemes_asset_type_code_asset_type_asset_type_code_fk" FOREIGN KEY ("asset_type_code") REFERENCES "public"."asset_type"("asset_type_code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mf_schemes" ADD CONSTRAINT "mf_schemes_base_currency_currency_currency_code_fk" FOREIGN KEY ("base_currency") REFERENCES "public"."currency"("currency_code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mf_schemes" ADD CONSTRAINT "mf_schemes_domicile_country_country_country_code_fk" FOREIGN KEY ("domicile_country") REFERENCES "public"."country"("country_code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mf_schemes" ADD CONSTRAINT "mf_schemes_benchmark_code_benchmark_benchmark_code_fk" FOREIGN KEY ("benchmark_code") REFERENCES "public"."benchmark"("benchmark_code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "security" ADD CONSTRAINT "security_security_type_asset_type_asset_type_code_fk" FOREIGN KEY ("security_type") REFERENCES "public"."asset_type"("asset_type_code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "security" ADD CONSTRAINT "security_sector_id_sector_sector_id_fk" FOREIGN KEY ("sector_id") REFERENCES "public"."sector"("sector_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "security" ADD CONSTRAINT "security_country_code_country_country_code_fk" FOREIGN KEY ("country_code") REFERENCES "public"."country"("country_code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "security" ADD CONSTRAINT "security_currency_code_currency_currency_code_fk" FOREIGN KEY ("currency_code") REFERENCES "public"."currency"("currency_code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "mf_nav_unique_idx" ON "mf_nav" USING btree ("mf_code","nav_date","nav");--> statement-breakpoint
CREATE INDEX "mf_nav_scheme_idx" ON "mf_nav" USING btree ("mf_code");