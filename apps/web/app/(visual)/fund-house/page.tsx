import AmcGrid from '@/components/amc-grid';
import { getAllAmcsWithStats } from '@finage/database/actions';

export default async function FundHousesPage() {
  const amcs = await getAllAmcsWithStats();

  return (
    <div className="flex flex-col gap-6 pt-28 px-6 mx-auto max-w-7xl pb-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Fund Houses</h1>
        <p className="text-muted-foreground mt-2">
          Browse all registered mutual fund houses in India
        </p>
      </div>

      <AmcGrid amcs={amcs} />
    </div>
  );
}
