import AllSchemesTable from '@/components/all-schemes-table';
import type { MFSchemeTable } from '@finage/core/mfTypes';
import { getAllMfSchemes } from '@finage/database/actions';

export default async function MFSchemes() {
  const mfSchemes = await getAllMfSchemes();
  const tableData: Array<MFSchemeTable> = mfSchemes.map((scheme) => ({
    logo: scheme.amcLogo,
    schemeName: scheme.schemeName,
    amcname: scheme.amcName,
    schemeCategory: scheme.schemeCategory,
    mfCode: scheme.mfCode,
  }));

  return (
    <div className="flex flex-col gap-6 pt-28 px-6 mx-auto max-w-7xl pb-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Mutual Fund Schemes</h1>
        <p className="text-muted-foreground mt-2">
          Explore and compare mutual fund schemes across all fund houses
        </p>
      </div>
      <AllSchemesTable data={tableData} />
    </div>
  );
}
