import { eq } from 'drizzle-orm';
import { getDb } from '../dbContext';
import { amc, mfSchemes } from '../schema';
import { mfSchemeCategory } from '../schema/mfSchemeCategory';

export async function getAllMfSchemes() {
  const db = await getDb();

  const schemeData = await db
    .select({
      mfCode: mfSchemes.mfCode,
      schemeName: mfSchemes.schemeName,
      schemeCategory: mfSchemeCategory.categoryName,
      amcName: amc.amcName,
      amcLogo: amc.amcLogoName,
    })
    .from(mfSchemes)
    .innerJoin(mfSchemeCategory, eq(mfSchemes.schemeCategory, mfSchemeCategory.categoryCode))
    .innerJoin(amc, eq(mfSchemes.amcCode, amc.amcCode))
    .orderBy(mfSchemes.schemeName);
  return schemeData;
}

export async function getMfSchemesByAmc(amcCode: string) {
  const db = await getDb();

  const schemeData = await db
    .select({
      mfCode: mfSchemes.mfCode,
      schemeName: mfSchemes.schemeName,
      schemeCategory: mfSchemeCategory.categoryName,
      amcName: amc.amcName,
      amcLogo: amc.amcLogoName,
    })
    .from(mfSchemes)
    .innerJoin(mfSchemeCategory, eq(mfSchemes.schemeCategory, mfSchemeCategory.categoryCode))
    .innerJoin(amc, eq(mfSchemes.amcCode, amc.amcCode))
    .where(eq(mfSchemes.amcCode, amcCode))
    .orderBy(mfSchemes.schemeName);
  return schemeData;
}

export async function getAmcByCode(amcCode: string) {
  const db = await getDb();

  const amcData = await db.query.amc.findFirst({
    where: eq(amc.amcCode, amcCode),
  });
  return amcData;
}

export async function getMfSchemesByCategory(categoryCode: number) {
  const db = await getDb();

  const schemeData = await db
    .select({
      mfCode: mfSchemes.mfCode,
      schemeName: mfSchemes.schemeName,
      schemeCategory: mfSchemeCategory.categoryName,
      amcName: amc.amcName,
      amcLogo: amc.amcLogoName,
    })
    .from(mfSchemes)
    .innerJoin(mfSchemeCategory, eq(mfSchemes.schemeCategory, mfSchemeCategory.categoryCode))
    .innerJoin(amc, eq(mfSchemes.amcCode, amc.amcCode))
    .where(eq(mfSchemes.schemeCategory, categoryCode))
    .orderBy(mfSchemes.schemeName);
  return schemeData;
}
