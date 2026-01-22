import { date, integer, numeric, pgTable, smallint, text } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';
import { assetType } from './assetType';
import { mfHoldingsPeriod } from './mfHoldingsPeriod';
import { mfSchemes } from './mfSchemes';

export const mfHoldings = pgTable('mf_holdings', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => `MH_${nanoid(16)}`),
  mfCode: text('mf_code').references(() => mfSchemes.mfCode),
  holdingType: smallint('holding_type').references(() => assetType.assetTypeCode),
  securityCode: text('security_code'),
  holdingAsOn: integer('mf_holding_as_on_code').references(
    () => mfHoldingsPeriod.mfHoldingPeriodCode
  ),
  weight: numeric('weight').notNull(),
  noOfUnits: numeric('no_of_units'),
  marketValue: numeric('market_value'),
  maturity_date: date('maturity_date'),
  coupon: numeric('coupon'),
});

export type MfHolding = typeof mfHoldings.$inferSelect;
export type NewMfHolding = typeof mfHoldings.$inferInsert;
