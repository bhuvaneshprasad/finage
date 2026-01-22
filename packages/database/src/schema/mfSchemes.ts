import {
  char,
  date,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';
import { amc } from './amc';
import { benchmark } from './benchmark';
import { country } from './country';
import { currency } from './currency';
import { mfSchemeCategory } from './mfSchemeCategory';

export const mfSchemes = pgTable(
  'mf_schemes',
  {
    mfCode: text('mf_code')
      .primaryKey()
      .$defaultFn(() => nanoid(8)),
    isin: text('isin').notNull(),
    schemeName: text('scheme_name').notNull(),
    amcCode: integer('amc_code')
      .notNull()
      .references(() => amc.amcCode),
    schemeCategory: integer('category_code').references(() => mfSchemeCategory.categoryCode),
    currency: char('currency', { length: 3 }).references(() => currency.currencyCode),
    country: char('country', { length: 3 }).references(() => country.countryCode),
    inceptionDate: date('inception_date'),
    benchmarkCode: integer('benchmark_code').references(() => benchmark.benchmarkCode),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (t) => [
    uniqueIndex('unique_isin_amc_scheme_category_idx').on(t.isin, t.amcCode, t.schemeCategory),
    index('isin_amc_idx').on(t.isin, t.amcCode),
  ]
);

export type MfScheme = typeof mfSchemes.$inferSelect;
export type NewMfScheme = typeof mfSchemes.$inferInsert;
