import { integer, pgTable, text } from 'drizzle-orm/pg-core';

export const mfSchemeCategory = pgTable('mf_scheme_category', {
  categoryCode: integer('category_code').primaryKey().generatedByDefaultAsIdentity(),
  categoryName: text('category_name').notNull().unique(),
});

export type MfSchemeCategory = typeof mfSchemeCategory.$inferSelect;
export type NewMfSchemeCategory = typeof mfSchemeCategory.$inferInsert;
