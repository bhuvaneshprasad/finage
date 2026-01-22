import { char, pgTable, text } from 'drizzle-orm/pg-core';

export const country = pgTable('country', {
  countryCode: char('country_code', { length: 3 }).primaryKey(),
  countryName: text('country_name').notNull(),
});

export type Country = typeof country.$inferSelect;
export type NewCountry = typeof country.$inferInsert;
