import { desc, eq, and, ne } from 'drizzle-orm';
import { getDb } from '../dbContext';
import {
  amc,
  benchmark,
  fundManagers,
  mfHoldings,
  mfNav,
  mfSchemeCategory,
  mfSchemeFundManagers,
  mfSchemes,
  security,
  assetType,
} from '../schema';

export async function getFundDetails(mfCode: string) {
  const db = await getDb();

  const fund = await db
    .select({
      mfCode: mfSchemes.mfCode,
      isin: mfSchemes.isin,
      schemeName: mfSchemes.schemeName,
      inceptionDate: mfSchemes.inceptionDate,
      amcCode: amc.amcCode,
      amcName: amc.amcName,
      amcLogo: amc.amcLogoName,
      categoryCode: mfSchemeCategory.categoryCode,
      categoryName: mfSchemeCategory.categoryName,
      benchmarkName: benchmark.benchmarkName,
    })
    .from(mfSchemes)
    .innerJoin(amc, eq(mfSchemes.amcCode, amc.amcCode))
    .leftJoin(mfSchemeCategory, eq(mfSchemes.schemeCategory, mfSchemeCategory.categoryCode))
    .leftJoin(benchmark, eq(mfSchemes.benchmarkCode, benchmark.benchmarkCode))
    .where(eq(mfSchemes.mfCode, mfCode))
    .limit(1);

  return fund[0] || null;
}

export async function getFundNav(mfCode: string, limit = 365) {
  const db = await getDb();

  const navData = await db
    .select({
      navDate: mfNav.navDate,
      nav: mfNav.nav,
    })
    .from(mfNav)
    .where(eq(mfNav.mfCode, mfCode))
    .orderBy(desc(mfNav.navDate))
    .limit(limit);

  return navData;
}

export async function getFundLatestNav(mfCode: string) {
  const db = await getDb();

  const latestNav = await db
    .select({
      navDate: mfNav.navDate,
      nav: mfNav.nav,
    })
    .from(mfNav)
    .where(eq(mfNav.mfCode, mfCode))
    .orderBy(desc(mfNav.navDate))
    .limit(1);

  return latestNav[0] || null;
}

export async function getFundManagers(mfCode: string) {
  const db = await getDb();

  const managers = await db
    .select({
      fundManagerId: fundManagers.fundManagerId,
      fundManagerName: fundManagers.fundManagerName,
      startDate: mfSchemeFundManagers.startDate,
      endDate: mfSchemeFundManagers.endDate,
      isCurrent: mfSchemeFundManagers.isCurrent,
    })
    .from(mfSchemeFundManagers)
    .innerJoin(fundManagers, eq(mfSchemeFundManagers.fundManagerId, fundManagers.fundManagerId))
    .where(eq(mfSchemeFundManagers.mfCode, mfCode))
    .orderBy(desc(mfSchemeFundManagers.isCurrent), mfSchemeFundManagers.startDate);

  return managers;
}

export async function getFundHoldings(mfCode: string) {
  const db = await getDb();

  const holdings = await db
    .select({
      id: mfHoldings.id,
      weight: mfHoldings.weight,
      marketValue: mfHoldings.marketValue,
      noOfUnits: mfHoldings.noOfUnits,
      holdingTypeName: assetType.assetTypeName,
      securityCode: mfHoldings.securityCode,
      securityName: security.securityName,
    })
    .from(mfHoldings)
    .leftJoin(assetType, eq(mfHoldings.holdingType, assetType.assetTypeCode))
    .leftJoin(security, eq(mfHoldings.securityCode, security.securityCode))
    .where(eq(mfHoldings.mfCode, mfCode))
    .orderBy(desc(mfHoldings.weight));

  return holdings;
}

export async function getRelatedSchemes(amcCode: number, excludeMfCode: string, limit = 6) {
  const db = await getDb();

  const schemes = await db
    .select({
      mfCode: mfSchemes.mfCode,
      schemeName: mfSchemes.schemeName,
      categoryName: mfSchemeCategory.categoryName,
      amcLogo: amc.amcLogoName,
    })
    .from(mfSchemes)
    .innerJoin(amc, eq(mfSchemes.amcCode, amc.amcCode))
    .leftJoin(mfSchemeCategory, eq(mfSchemes.schemeCategory, mfSchemeCategory.categoryCode))
    .where(and(eq(mfSchemes.amcCode, amcCode), ne(mfSchemes.mfCode, excludeMfCode)))
    .limit(limit);

  return schemes;
}
