'use client';

import type { MFSchemeTable } from '@finage/core/mfTypes';
import SchemesTable from './schemes-table';

export default function AllSchemesTable({ data }: { data: MFSchemeTable[] }) {
  return (
    <div className="flex justify-center px-6 pt-4">
      <div className="w-full max-w-7xl">
        <SchemesTable
          data={data}
          title="All Schemes"
          filteredTitle="Filtered Results"
          showAmcFilter={true}
          showAmcInSchemeColumn={true}
          searchPlaceholder="Search schemes, AMC, or category..."
        />
      </div>
    </div>
  );
}
