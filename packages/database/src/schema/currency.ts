import { char, pgTable, text } from 'drizzle-orm/pg-core';

export const currency = pgTable('currency', {
  currencyCode: char('currency_code', { length: 3 }).primaryKey(),
  currencyName: text('currency_name'),
});

export type Currency = typeof currency.$inferSelect;
export type NewCurrency = typeof currency.$inferInsert;
