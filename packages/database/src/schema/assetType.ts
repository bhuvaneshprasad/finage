import { pgTable, smallint, text } from 'drizzle-orm/pg-core';

export const assetType = pgTable('asset_type', {
  assetTypeCode: smallint('asset_type_code').primaryKey().generatedByDefaultAsIdentity(),
  assetTypeName: text('asset_type_name').notNull().unique(),
});

export type AssetType = typeof assetType.$inferSelect;
export type NewAssetType = typeof assetType.$inferInsert;
