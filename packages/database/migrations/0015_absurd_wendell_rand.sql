ALTER TABLE "mf_holdings" DROP CONSTRAINT "mf_holdings_security_code_security_security_code_fk";
--> statement-breakpoint
ALTER TABLE "mf_holdings" ALTER COLUMN "security_code" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "security" ALTER COLUMN "security_code" SET DATA TYPE text;