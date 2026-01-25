import { getAllCategoriesWithSchemeCount } from '@finage/database/actions';
import { FolderOpen, Layers } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

export default async function CategoriesPage() {
  const categories = await getAllCategoriesWithSchemeCount();

  const totalSchemes = categories.reduce((sum, cat) => sum + cat.schemeCount, 0);

  return (
    <div className="flex flex-col gap-6 pt-28 px-6 mx-auto max-w-7xl pb-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Scheme Categories</h1>
        <p className="text-muted-foreground mt-2">
          Browse mutual fund schemes by investment category
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-2 text-sm text-muted-foreground">
        <span>
          <span className="font-semibold text-foreground">{categories.length}</span> Categories
        </span>
        <span className="hidden sm:inline">•</span>
        <span>
          <span className="font-semibold text-foreground">{totalSchemes.toLocaleString()}</span> Schemes
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Link key={category.categoryCode} href={`/categories/${category.categoryCode}`}>
            <Card className="group h-full p-4 transition-all hover:shadow-lg hover:border-primary/50">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FolderOpen className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                    {category.categoryName}
                  </h3>
                  <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
                    <Layers className="h-3 w-3" />
                    <span>{category.schemeCount.toLocaleString()} schemes</span>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
