import { integer, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';
import { amc } from './amc';

export const mfSchemeGroups = pgTable(
  'mf_scheme_groups',
  {
    schemeGroudId: text('scheme_group_id')
      .primaryKey()
      .$defaultFn(() => nanoid(8)),
    extSchemeId: integer('ext_scheme_id'),
    amcCode: integer('amc_code').references(() => amc.amcCode),
    schemeGroupName: text('scheme_name'),
    schemeGroupObjective: text('scheme_objective'),
    schemeType: text('scheme_type'),
    launchDate: text('launch_date'),
    schemeLoad: text('scheme_load'),
    schemeMinInvestAmt: text('min_invest_amt'),
  },
  (t) => [uniqueIndex('unique_id_amc_idx').on(t.extSchemeId, t.amcCode)]
);

export type MfSchemeGroup = typeof mfSchemeGroups.$inferSelect;
export type NewMfSchemeGroup = typeof mfSchemeGroups.$inferInsert;
