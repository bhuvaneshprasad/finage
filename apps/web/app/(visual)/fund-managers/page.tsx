import FundManagersGrid from '@/components/fund-managers-grid';
import { getAllFundManagersWithStats, getTotalUniqueSchemes } from '@finage/database/actions';

export default async function FundManagersPage() {
  const [fundManagers, totalUniqueSchemes] = await Promise.all([
    getAllFundManagersWithStats(),
    getTotalUniqueSchemes(),
  ]);

  return (
    <div className="flex flex-col gap-6 pt-28 px-6 mx-auto max-w-7xl pb-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Fund Managers</h1>
        <p className="text-muted-foreground mt-2">
          Meet the professionals managing your investments
        </p>
      </div>

      <FundManagersGrid data={fundManagers} totalUniqueSchemes={totalUniqueSchemes} />
    </div>
  );
}
