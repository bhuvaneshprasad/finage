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
    <div className="flex-col pt-28">
      <div className="flex justify-center">
        <span className="text-3xl font-medium uppercase">Mutual Fund Schemes</span>
      </div>
      <AllSchemesTable data={tableData} />
    </div>
  );
}
