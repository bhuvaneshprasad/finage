import { pgTable, smallint, text } from 'drizzle-orm/pg-core';

export const amc = pgTable('amc', {
  amcCode: smallint('amc_code').primaryKey().generatedByDefaultAsIdentity(),
  amcName: text('amc_name').notNull().unique(),
  amcLogoName: text('amc_logo_name').notNull().unique(),
});

export type AMC = typeof amc.$inferSelect;
export type NewAMC = typeof amc.$inferInsert;
