import SchemesTable from '@/components/schemes-table';
import type { MFSchemeTable } from '@finage/core/mfTypes';
import { getCategoryByCode, getMfSchemesByCategory } from '@finage/database/actions';
import { FolderOpen } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function CategorySchemesPage({
  params,
}: {
  params: Promise<{ categoryCode: string }>;
}) {
  const { categoryCode } = await params;
  const categoryCodeNum = parseInt(categoryCode, 10);

  if (isNaN(categoryCodeNum)) {
    notFound();
  }

  const [category, schemes] = await Promise.all([
    getCategoryByCode(categoryCodeNum),
    getMfSchemesByCategory(categoryCodeNum),
  ]);

  if (!category) {
    notFound();
  }

  const tableData: Array<MFSchemeTable> = schemes.map((scheme) => ({
    logo: scheme.amcLogo,
    schemeName: scheme.schemeName,
    amcname: scheme.amcName,
    schemeCategory: scheme.schemeCategory,
    mfCode: scheme.mfCode,
  }));

  return (
    <div className="flex flex-col gap-6 pt-28 px-6 mx-auto max-w-7xl pb-8">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <FolderOpen className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{category.categoryName}</h1>
          <p className="text-muted-foreground">
            {tableData.length.toLocaleString()} schemes in this category
          </p>
        </div>
      </div>

      <SchemesTable
        data={tableData}
        title="Category Schemes"
        filteredTitle="Filtered Schemes"
        showAmcFilter={true}
        showCategoryFilter={false}
        showAmcInSchemeColumn={true}
        searchPlaceholder="Search schemes or AMC..."
      />
    </div>
  );
}
