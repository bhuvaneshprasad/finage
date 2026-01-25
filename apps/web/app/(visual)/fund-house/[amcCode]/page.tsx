import SchemesTable from '@/components/schemes-table';
import type { MFSchemeTable } from '@finage/core/mfTypes';
import { getAmcByCode, getMfSchemesByAmc } from '@finage/database/actions';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export default async function FundHousePage({
  params,
}: {
  params: Promise<{ amcCode: string }>;
}) {
  const { amcCode } = await params;

  const [amcData, mfSchemes] = await Promise.all([
    getAmcByCode(amcCode),
    getMfSchemesByAmc(amcCode),
  ]);

  if (!amcData) {
    notFound();
  }

  const tableData: Array<MFSchemeTable> = mfSchemes.map((scheme) => ({
    logo: scheme.amcLogo,
    schemeName: scheme.schemeName,
    amcname: scheme.amcName,
    schemeCategory: scheme.schemeCategory,
    mfCode: scheme.mfCode,
  }));

  return (
    <div className="flex flex-col gap-6 pt-28 px-6 mx-auto max-w-7xl pb-8">
      <div className="flex items-center gap-4">
        {amcData.amcLogoName && (
          <Image
            src={`/amc_logo/${amcData.amcLogoName}`}
            alt={amcData.amcName || 'AMC Logo'}
            width={64}
            height={64}
            className="rounded-lg"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold">{amcData.amcName}</h1>
          <p className="text-muted-foreground">
            {tableData.length.toLocaleString()} schemes available
          </p>
        </div>
      </div>

      <SchemesTable
        data={tableData}
        title="Fund House Schemes"
        filteredTitle="Filtered Schemes"
        showAmcFilter={false}
        showAmcInSchemeColumn={false}
        searchPlaceholder="Search schemes or category..."
      />
    </div>
  );
}
