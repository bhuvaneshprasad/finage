import { date, integer, pgTable } from 'drizzle-orm/pg-core';

export const mfHoldingsPeriod = pgTable('mf_holdig_period', {
  mfHoldingPeriodCode: integer('mf_holding_period_code').primaryKey().generatedByDefaultAsIdentity(),
  mfHoldingAsOn: date('mf_holding_as_on').notNull().unique(),
});

export type MFHoldingPeriod = typeof mfHoldingsPeriod.$inferSelect;
export type NewMFHoldingPeriod = typeof mfHoldingsPeriod.$inferInsert;
