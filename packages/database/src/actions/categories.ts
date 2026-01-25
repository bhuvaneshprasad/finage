import { count, eq } from 'drizzle-orm';
import { getDb } from '../dbContext';
import { mfSchemeCategory, mfSchemes } from '../schema';

export type CategoryWithSchemeCount = {
  categoryCode: number;
  categoryName: string;
  schemeCount: number;
};

export async function getAllCategoriesWithSchemeCount(): Promise<CategoryWithSchemeCount[]> {
  const db = await getDb();

  const categories = await db
    .select({
      categoryCode: mfSchemeCategory.categoryCode,
      categoryName: mfSchemeCategory.categoryName,
      schemeCount: count(mfSchemes.mfCode),
    })
    .from(mfSchemeCategory)
    .leftJoin(mfSchemes, eq(mfSchemeCategory.categoryCode, mfSchemes.schemeCategory))
    .groupBy(mfSchemeCategory.categoryCode, mfSchemeCategory.categoryName)
    .orderBy(mfSchemeCategory.categoryName);

  return categories;
}

export async function getCategoryByCode(categoryCode: number) {
  const db = await getDb();

  const category = await db.query.mfSchemeCategory.findFirst({
    where: eq(mfSchemeCategory.categoryCode, categoryCode),
  });

  return category;
}
