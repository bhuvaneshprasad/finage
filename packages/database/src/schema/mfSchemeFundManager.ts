import { boolean, date, integer, pgTable, text } from 'drizzle-orm/pg-core';
import { fundManagers } from './fund_managers';
import { mfSchemes } from './mfSchemes';

export const mfSchemeFundManagers = pgTable('mf_scheme_fund_managers', {
  mfCode: text('mf_code').references(() => mfSchemes.mfCode),
  fundManagerId: integer('fund_manager_id').references(() => fundManagers.fundManagerId),
  startDate: date('start_date').notNull(),
  endDate: date('end_date'),
  isCurrent: boolean('is_current').notNull(),
});

export type MfSchemeFundManager = typeof mfSchemeFundManagers.$inferSelect;
export type NewMfSchemeFundManager = typeof mfSchemeFundManagers.$inferInsert;
