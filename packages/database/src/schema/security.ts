import { char, integer, pgTable, smallint, text } from 'drizzle-orm/pg-core';
import { assetType } from './assetType';
import { country } from './country';
import { currency } from './currency';
import { sector } from './sector';

export const security = pgTable('security', {
  securityCode: text('security_code').primaryKey(),
  isin: char('isin').notNull(),
  securityTicker: char('ticker'),
  securityName: text('security_name').notNull(),
  securityType: smallint('security_type').references(() => assetType.assetTypeCode),
  sectorId: integer('sector_id').references(() => sector.sectorId),
  countryCode: char('country_code').references(() => country.countryCode),
  currency: char('currency_code').references(() => currency.currencyCode),
});

export type Security = typeof security.$inferSelect;
export type NewSecurity = typeof security.$inferInsert;
