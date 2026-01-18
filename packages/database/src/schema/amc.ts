import { pgTable, smallint, text } from 'drizzle-orm/pg-core';

export const amc = pgTable('amc', {
  amcCode: smallint('amc_code').primaryKey(),
  amcName: text('amc_name').notNull(),
});

export type AMC = typeof amc.$inferSelect;
export type NewAMC = typeof amc.$inferInsert;
