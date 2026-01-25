import { count, countDistinct, eq } from 'drizzle-orm';
import { getDb } from '../dbContext';
import { amc, mfSchemes, type AMC } from '../schema';

export async function getAllAmcs(): Promise<Array<AMC>> {
  const db = await getDb();

  const amcs = db.query.amc.findMany();
  return amcs;
}

export type AmcWithStats = AMC & { 
  schemeCount: number;
  categoryCount: number;
};

export async function getAllAmcsWithStats(): Promise<Array<AmcWithStats>> {
  const db = await getDb();

  const amcsWithStats = await db
    .select({
      amcCode: amc.amcCode,
      amcName: amc.amcName,
      amcLogoName: amc.amcLogoName,
      schemeCount: count(mfSchemes.mfCode),
      categoryCount: countDistinct(mfSchemes.schemeCategory),
    })
    .from(amc)
    .leftJoin(mfSchemes, eq(amc.amcCode, mfSchemes.amcCode))
    .groupBy(amc.amcCode, amc.amcName, amc.amcLogoName)
    .orderBy(amc.amcName);

  return amcsWithStats;
}
