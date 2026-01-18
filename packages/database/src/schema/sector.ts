import { integer, pgTable, text } from 'drizzle-orm/pg-core';

export const sector = pgTable('sector', {
  sectorId: integer('sector_id').primaryKey(),
  sectorName: text('sector_name').notNull(),
});

export type Sector = typeof sector.$inferSelect;
export type NewSector = typeof sector.$inferInsert;
