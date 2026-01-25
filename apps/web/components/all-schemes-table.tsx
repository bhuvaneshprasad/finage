'use client';

import type { MFSchemeTable } from '@finage/core/mfTypes';
import SchemesTable from './schemes-table';

export default function AllSchemesTable({ data }: { data: MFSchemeTable[] }) {
  return (
    <SchemesTable
      data={data}
      title="All Schemes"
      filteredTitle="Filtered Results"
      showAmcFilter={true}
      showAmcInSchemeColumn={true}
      searchPlaceholder="Search schemes, AMC, or category..."
    />
  );
}
