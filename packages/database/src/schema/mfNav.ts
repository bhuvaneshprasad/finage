import { date, index, numeric, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core';
import { mfSchemes } from './mfSchemes';

export const mfNav = pgTable(
  'mf_nav',
  {
    mfCode: text('mf_code').references(() => mfSchemes.mfCode),
    navDate: date('nav_date').notNull(),
    nav: numeric('nav').notNull(),
    cagr1w: numeric('cagr_1w'),
    cagr1m: numeric('cagr_1m'),
    cagr3m: numeric('cagr_3m'),
    cagr6m: numeric('cagr_6m'),
    cagr1y: numeric('cagr_1y'),
    cagr2y: numeric('cagr_2y'),
    cagr3y: numeric('cagr_3y'),
    cagr5y: numeric('cagr_5y'),
    cagr7y: numeric('cagr_7y'),
    cagr10y: numeric('cagr_10y'),
    cagr15y: numeric('cagr_15y'),
  },
  (table) => [
    uniqueIndex('mf_nav_unique_idx').on(table.mfCode, table.navDate),
    index('mf_nav_scheme_idx').on(table.mfCode),
  ]
);

export type MfNav = typeof mfNav.$inferSelect;
export type NewMfNav = typeof mfNav.$inferInsert;
