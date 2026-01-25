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
    .orderBy(mfSchemes.schemeName)
    .limit(10);
  return schemeData;
}
