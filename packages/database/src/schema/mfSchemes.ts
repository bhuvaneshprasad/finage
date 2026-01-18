import { char, date, integer, pgTable, smallint, text, timestamp } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';
import { amc } from './amc';
import { assetType } from './assetType';
import { benchmark } from './benchmark';
import { country } from './country';
import { currency } from './currency';

export const mfSchemes = pgTable('mf_schemes', {
  mfCode: text('mf_code')
    .primaryKey()
    .$defaultFn(() => nanoid(8)),
  isin: char('isin').notNull(),
  schemeName: text('scheme_name').notNull(),
  amcCode: integer('amc_code')
    .notNull()
    .references(() => amc.amcCode),
  assetTypeCode: smallint('asset_type_code')
    .notNull()
    .references(() => assetType.assetTypeCode),
  baseCurrency: char('base_currency').references(() => currency.currencyCode),
  country: char('domicile_country').references(() => country.countryCode),
  inceptionDate: date('inception_date'),
  benchmark_code: integer('benchmark_code').references(() => benchmark.benchmarkCode),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type MfScheme = typeof mfSchemes.$inferSelect;
export type NewMfScheme = typeof mfSchemes.$inferInsert;
