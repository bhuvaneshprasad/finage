import { char, integer, pgTable, text } from 'drizzle-orm/pg-core';

export const fundManagers = pgTable('fund_managers', {
  fundManagerId: integer('fund_managers_id').primaryKey(),
  fundManagerName: text('fund_manager_name').notNull(),
  gender: char('gender'),
});

export type FundManager = typeof fundManagers.$inferSelect;
export type NewFundManager = typeof fundManagers.$inferInsert;
