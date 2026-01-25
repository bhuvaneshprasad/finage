import {
  getFundManagerById,
  getFundManagerCoManagers,
  getFundManagerCurrentAmc,
  getFundManagerFirstStartDate,
  getFundManagerSchemes,
  getFundManagerStats,
  getSharedSchemes,
} from '@finage/database/actions';
import { notFound } from 'next/navigation';
import FundManagerDetail from '@/components/fund-manager-detail';

function calculateExperience(startDate: Date): string {
  const now = new Date();
  const start = new Date(startDate);
  const years = now.getFullYear() - start.getFullYear();
  const months = now.getMonth() - start.getMonth();

  let totalMonths = years * 12 + months;
  if (totalMonths < 0) totalMonths = 0;

  const expYears = Math.floor(totalMonths / 12);
  const expMonths = totalMonths % 12;

  if (expYears === 0) {
    return `${expMonths} month${expMonths !== 1 ? 's' : ''}`;
  } else if (expMonths === 0) {
    return `${expYears} year${expYears !== 1 ? 's' : ''}`;
  } else {
    return `${expYears}y ${expMonths}m`;
  }
}

export default async function FundManagerDetailPage({
  params,
}: {
  params: Promise<{ fundManagerId: string }>;
}) {
  const { fundManagerId } = await params;
  const managerId = parseInt(fundManagerId, 10);

  if (isNaN(managerId)) {
    notFound();
  }

  const [manager, stats, schemes, currentAmc, firstStartDate, coManagers] = await Promise.all([
    getFundManagerById(managerId),
    getFundManagerStats(managerId),
    getFundManagerSchemes(managerId),
    getFundManagerCurrentAmc(managerId),
    getFundManagerFirstStartDate(managerId),
    getFundManagerCoManagers(managerId),
  ]);

  if (!manager) {
    notFound();
  }

  const sharedSchemesMap: Record<number, Awaited<ReturnType<typeof getSharedSchemes>>> = {};
  await Promise.all(
    coManagers.map(async (cm) => {
      sharedSchemesMap[cm.fundManagerId] = await getSharedSchemes(managerId, cm.fundManagerId);
    })
  );

  const experience = firstStartDate ? calculateExperience(firstStartDate) : null;

  return (
    <FundManagerDetail
      manager={manager}
      stats={stats}
      schemes={schemes}
      currentAmc={currentAmc}
      experience={experience}
      firstStartDate={firstStartDate}
      coManagers={coManagers}
      sharedSchemesMap={sharedSchemesMap}
    />
  );
}
