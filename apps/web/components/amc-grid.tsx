import type { AmcWithStats } from '@finage/database/actions';
import { useMemo } from 'react';
import AmcCard from './amc-card';

interface AmcGridProps {
  amcs: AmcWithStats[];
}

export default function AmcGrid({ amcs }: AmcGridProps) {
  const totalSchemes = useMemo(() => {
    return amcs.reduce((sum, amc) => sum + amc.schemeCount, 0);
  }, [amcs]);

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-6 text-sm text-muted-foreground">
        <span>
          <span className="font-semibold text-foreground">{amcs.length}</span> Fund Houses
        </span>
        <span className="hidden sm:inline">•</span>
        <span>
          <span className="font-semibold text-foreground">{totalSchemes.toLocaleString()}</span>{' '}
          Schemes
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {amcs.map((amc) => (
          <AmcCard key={amc.amcCode} amc={amc} />
        ))}
      </div>
    </div>
  );
}
