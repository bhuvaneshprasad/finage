import { count, countDistinct, eq, and, sql, asc, ne } from 'drizzle-orm';
import { getDb } from '../dbContext';
import { amc, fundManagers, mfSchemeCategory, mfSchemeFundManagers, mfSchemes } from '../schema';

export type FundManagerWithStats = {
  fundManagerId: number;
  fundManagerName: string;
  gender: string | null;
  activeSchemeCount: number;
  pastSchemeCount: number;
  currentAmcName: string | null;
  firstStartDate: Date | null; // The earliest date this manager started managing a fund
  yearsOfExperience: number | null; // Calculated from firstStartDate to now
};

export async function getAllFundManagersWithStats(): Promise<FundManagerWithStats[]> {
  const db = await getDb();

  const managers = await db
    .select({
      fundManagerId: fundManagers.fundManagerId,
      fundManagerName: fundManagers.fundManagerName,
      gender: fundManagers.gender,
      activeSchemeCount: count(mfSchemeFundManagers.mfCode),
    })
    .from(fundManagers)
    .leftJoin(
      mfSchemeFundManagers,
      and(
        eq(fundManagers.fundManagerId, mfSchemeFundManagers.fundManagerId),
        eq(mfSchemeFundManagers.isCurrent, true)
      )
    )
    .groupBy(fundManagers.fundManagerId, fundManagers.fundManagerName, fundManagers.gender)
    .orderBy(fundManagers.fundManagerName);

  const managersWithAmc = await Promise.all(
    managers.map(async (manager) => {
      // Fetch current AMC name for this fund manager
      const currentAmc = await db
        .selectDistinct({ amcName: amc.amcName })
        .from(mfSchemeFundManagers)
        .innerJoin(mfSchemes, eq(mfSchemeFundManagers.mfCode, mfSchemes.mfCode))
        .innerJoin(amc, eq(mfSchemes.amcCode, amc.amcCode))
        .where(
          and(
            eq(mfSchemeFundManagers.fundManagerId, manager.fundManagerId),
            eq(mfSchemeFundManagers.isCurrent, true)
          )
        )
        .limit(1);

      // Count past (inactive) schemes for this manager
      const pastCount = await db
        .select({ count: count() })
        .from(mfSchemeFundManagers)
        .where(
          and(
            eq(mfSchemeFundManagers.fundManagerId, manager.fundManagerId),
            eq(mfSchemeFundManagers.isCurrent, false)
          )
        );

      // Get the earliest start date for experience calculation
      const firstStart = await db
        .select({ startDate: mfSchemeFundManagers.startDate })
        .from(mfSchemeFundManagers)
        .where(eq(mfSchemeFundManagers.fundManagerId, manager.fundManagerId))
        .orderBy(asc(mfSchemeFundManagers.startDate))
        .limit(1);

      // startDate from DB might be a string or Date, so we normalize it
      const rawStartDate = firstStart[0]?.startDate;
      const firstStartDate = rawStartDate ? new Date(rawStartDate) : null;
      
      // Calculate years of experience from firstStartDate to now
      let yearsOfExperience: number | null = null;
      if (firstStartDate && !isNaN(firstStartDate.getTime())) {
        const now = new Date();
        const diffMs = now.getTime() - firstStartDate.getTime();
        // Convert milliseconds to years (more precise calculation)
        yearsOfExperience = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25));
      }

      return {
        ...manager,
        pastSchemeCount: pastCount[0]?.count || 0,
        currentAmcName: currentAmc[0]?.amcName || null,
        firstStartDate,
        yearsOfExperience,
      };
    })
  );

  return managersWithAmc;
}

export async function getTotalUniqueSchemes(): Promise<number> {
  const db = await getDb();

  const result = await db
    .select({
      uniqueSchemes: countDistinct(mfSchemeFundManagers.mfCode),
    })
    .from(mfSchemeFundManagers)
    .where(eq(mfSchemeFundManagers.isCurrent, true));

  return result[0]?.uniqueSchemes || 0;
}

export async function getFundManagerById(fundManagerId: number) {
  const db = await getDb();

  const manager = await db.query.fundManagers.findFirst({
    where: eq(fundManagers.fundManagerId, fundManagerId),
  });

  return manager;
}

export async function getFundManagerCurrentAmc(fundManagerId: number): Promise<string | null> {
  const db = await getDb();

  const currentAmc = await db
    .selectDistinct({ amcName: amc.amcName })
    .from(mfSchemeFundManagers)
    .innerJoin(mfSchemes, eq(mfSchemeFundManagers.mfCode, mfSchemes.mfCode))
    .innerJoin(amc, eq(mfSchemes.amcCode, amc.amcCode))
    .where(
      and(
        eq(mfSchemeFundManagers.fundManagerId, fundManagerId),
        eq(mfSchemeFundManagers.isCurrent, true)
      )
    )
    .limit(1);

  return currentAmc[0]?.amcName || null;
}

export type FundManagerDetailStats = {
  activeSchemeCount: number;
  pastSchemeCount: number;
  totalSchemeCount: number;
};

export async function getFundManagerStats(fundManagerId: number): Promise<FundManagerDetailStats> {
  const db = await getDb();

  const activeResult = await db
    .select({ count: count() })
    .from(mfSchemeFundManagers)
    .where(
      and(
        eq(mfSchemeFundManagers.fundManagerId, fundManagerId),
        eq(mfSchemeFundManagers.isCurrent, true)
      )
    );

  const pastResult = await db
    .select({ count: count() })
    .from(mfSchemeFundManagers)
    .where(
      and(
        eq(mfSchemeFundManagers.fundManagerId, fundManagerId),
        eq(mfSchemeFundManagers.isCurrent, false)
      )
    );

  const totalResult = await db
    .select({ count: count() })
    .from(mfSchemeFundManagers)
    .where(eq(mfSchemeFundManagers.fundManagerId, fundManagerId));

  return {
    activeSchemeCount: activeResult[0]?.count || 0,
    pastSchemeCount: pastResult[0]?.count || 0,
    totalSchemeCount: totalResult[0]?.count || 0,
  };
}

export type FundManagerScheme = {
  mfCode: string;
  schemeName: string;
  amcName: string;
  amcLogo: string | null;
  categoryName: string | null;
  startDate: Date;
  endDate: Date | null;
  isCurrent: boolean;
};

export async function getFundManagerSchemes(fundManagerId: number): Promise<FundManagerScheme[]> {
  const db = await getDb();

  const schemes = await db
    .select({
      mfCode: mfSchemeFundManagers.mfCode,
      schemeName: mfSchemes.schemeName,
      amcName: amc.amcName,
      amcLogo: amc.amcLogoName,
      categoryName: mfSchemeCategory.categoryName,
      startDate: mfSchemeFundManagers.startDate,
      endDate: mfSchemeFundManagers.endDate,
      isCurrent: mfSchemeFundManagers.isCurrent,
    })
    .from(mfSchemeFundManagers)
    .innerJoin(mfSchemes, eq(mfSchemeFundManagers.mfCode, mfSchemes.mfCode))
    .innerJoin(amc, eq(mfSchemes.amcCode, amc.amcCode))
    .leftJoin(mfSchemeCategory, eq(mfSchemes.schemeCategory, mfSchemeCategory.categoryCode))
    .where(eq(mfSchemeFundManagers.fundManagerId, fundManagerId))
    .orderBy(sql`${mfSchemeFundManagers.isCurrent} DESC`, mfSchemes.schemeName);

  return schemes;
}

export async function getFundManagerFirstStartDate(fundManagerId: number): Promise<Date | null> {
  const db = await getDb();

  const result = await db
    .select({ startDate: mfSchemeFundManagers.startDate })
    .from(mfSchemeFundManagers)
    .where(eq(mfSchemeFundManagers.fundManagerId, fundManagerId))
    .orderBy(asc(mfSchemeFundManagers.startDate))
    .limit(1);

  return result[0]?.startDate || null;
}

export type CoManager = {
  fundManagerId: number;
  fundManagerName: string;
  sharedSchemeCount: number;
};

export async function getFundManagerCoManagers(fundManagerId: number): Promise<CoManager[]> {
  const db = await getDb();

  const managerSchemes = await db
    .select({ mfCode: mfSchemeFundManagers.mfCode })
    .from(mfSchemeFundManagers)
    .where(eq(mfSchemeFundManagers.fundManagerId, fundManagerId));

  const mfCodes = managerSchemes.map((s) => s.mfCode);

  if (mfCodes.length === 0) return [];

  const coManagersRaw = await db
    .select({
      fundManagerId: mfSchemeFundManagers.fundManagerId,
      fundManagerName: fundManagers.fundManagerName,
      mfCode: mfSchemeFundManagers.mfCode,
    })
    .from(mfSchemeFundManagers)
    .innerJoin(fundManagers, eq(mfSchemeFundManagers.fundManagerId, fundManagers.fundManagerId))
    .where(
      and(
        ne(mfSchemeFundManagers.fundManagerId, fundManagerId),
        sql`${mfSchemeFundManagers.mfCode} IN (${sql.join(mfCodes.map(c => sql`${c}`), sql`, `)})`
      )
    );

  const coManagerMap = new Map<number, { name: string; count: number }>();
  for (const cm of coManagersRaw) {
    const existing = coManagerMap.get(cm.fundManagerId);
    if (existing) {
      existing.count++;
    } else {
      coManagerMap.set(cm.fundManagerId, { name: cm.fundManagerName, count: 1 });
    }
  }

  const coManagers: CoManager[] = Array.from(coManagerMap.entries())
    .map(([id, data]) => ({
      fundManagerId: id,
      fundManagerName: data.name,
      sharedSchemeCount: data.count,
    }))
    .sort((a, b) => b.sharedSchemeCount - a.sharedSchemeCount)
    .slice(0, 10);

  return coManagers;
}

export type SharedScheme = {
  mfCode: string;
  schemeName: string;
  amcName: string;
  amcLogo: string | null;
  categoryName: string | null;
};

export async function getSharedSchemes(
  fundManagerId: number,
  coManagerId: number
): Promise<SharedScheme[]> {
  const db = await getDb();

  const manager1Schemes = await db
    .select({ mfCode: mfSchemeFundManagers.mfCode })
    .from(mfSchemeFundManagers)
    .where(eq(mfSchemeFundManagers.fundManagerId, fundManagerId));

  const manager2Schemes = await db
    .select({ mfCode: mfSchemeFundManagers.mfCode })
    .from(mfSchemeFundManagers)
    .where(eq(mfSchemeFundManagers.fundManagerId, coManagerId));

  const mfCodes1 = new Set(manager1Schemes.map((s) => s.mfCode));
  const sharedMfCodes = manager2Schemes
    .filter((s) => mfCodes1.has(s.mfCode))
    .map((s) => s.mfCode);

  if (sharedMfCodes.length === 0) return [];

  const schemes = await db
    .select({
      mfCode: mfSchemes.mfCode,
      schemeName: mfSchemes.schemeName,
      amcName: amc.amcName,
      amcLogo: amc.amcLogoName,
      categoryName: mfSchemeCategory.categoryName,
    })
    .from(mfSchemes)
    .innerJoin(amc, eq(mfSchemes.amcCode, amc.amcCode))
    .leftJoin(mfSchemeCategory, eq(mfSchemes.schemeCategory, mfSchemeCategory.categoryCode))
    .where(sql`${mfSchemes.mfCode} IN (${sql.join(sharedMfCodes.map(c => sql`${c}`), sql`, `)})`)
    .orderBy(mfSchemes.schemeName);

  return schemes;
}
