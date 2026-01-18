import { date, index, numeric, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core';
import { mfSchemes } from './mfSchemes';

export const mfNav = pgTable(
  'mf_nav',
  {
    mfCode: text('mf_code').references(() => mfSchemes.mfCode),
    navDate: date('nav_date').notNull(),
    nav: numeric('nav').notNull(),
  },
  (table) => [
    uniqueIndex('mf_nav_unique_idx').on(table.mfCode, table.navDate, table.nav),
    index('mf_nav_scheme_idx').on(table.mfCode),
  ]
);

export type MfNav = typeof mfNav.$inferSelect;
export type NewMfNav = typeof mfNav.$inferInsert;
