import {
  getFundDetails,
  getFundHoldings,
  getFundLatestNav,
  getFundManagers,
  getFundNav,
  getRelatedSchemes,
} from '@finage/database/actions';
import {
  ArrowUpRight,
  Briefcase,
  Calendar,
  FileText,
  Layers,
  PieChart,
  TrendingUp,
  User,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default async function FundDetailPage({
  params,
}: {
  params: Promise<{ mfCode: string }>;
}) {
  const { mfCode } = await params;

  const [fundDetails, latestNav, fundManagers, holdings, navHistory] = await Promise.all([
    getFundDetails(mfCode),
    getFundLatestNav(mfCode),
    getFundManagers(mfCode),
    getFundHoldings(mfCode),
    getFundNav(mfCode, 30),
  ]);

  if (!fundDetails) {
    notFound();
  }

  const relatedSchemes = await getRelatedSchemes(fundDetails.amcCode, mfCode, 4);

  const currentManagers = fundManagers.filter((m) => m.isCurrent);
  const topHoldings = holdings.slice(0, 10);

  const navChange = navHistory.length >= 2
    ? ((Number(navHistory[0]?.nav) - Number(navHistory[navHistory.length - 1]?.nav)) /
        Number(navHistory[navHistory.length - 1]?.nav)) *
      100
    : null;

  return (
    <div className="flex flex-col gap-6 pt-28 px-6 mx-auto max-w-7xl pb-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        <div className="flex items-center gap-4 flex-1">
          {fundDetails.amcLogo && (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white p-2 ring-1 ring-border/50">
              <Image
                src={`/amc_logo/${fundDetails.amcLogo}`}
                alt={fundDetails.amcName || 'AMC Logo'}
                width={52}
                height={52}
                className="object-contain"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold leading-tight">{fundDetails.schemeName}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Link
                href={`/fund-house/${fundDetails.amcCode}`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {fundDetails.amcName}
              </Link>
              {fundDetails.categoryName && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <Badge variant="secondary">{fundDetails.categoryName}</Badge>
                </>
              )}
            </div>
          </div>
        </div>

        {/* NAV Card */}
        {latestNav && (
          <Card className="md:w-64 shrink-0">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Latest NAV</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">₹{Number(latestNav.nav).toFixed(2)}</span>
                {navChange !== null && (
                  <span
                    className={`text-sm font-medium ${navChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                  >
                    {navChange >= 0 ? '+' : ''}
                    {navChange.toFixed(2)}%
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                as of {new Date(latestNav.navDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Calendar className="h-4 w-4" />
              <span className="text-xs">Inception Date</span>
            </div>
            <div className="font-semibold">
              {fundDetails.inceptionDate
                ? new Date(fundDetails.inceptionDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : '-'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs">Benchmark</span>
            </div>
            <div className="font-semibold text-sm truncate">{fundDetails.benchmarkName || '-'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <FileText className="h-4 w-4" />
              <span className="text-xs">ISIN</span>
            </div>
            <div className="font-mono text-sm">{fundDetails.isin}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Users className="h-4 w-4" />
              <span className="text-xs">Fund Managers</span>
            </div>
            <div className="font-semibold">{currentManagers.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fund Managers Section */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5" />
              Fund Managers
            </CardTitle>
            <CardDescription>Current management team</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentManagers.length > 0 ? (
              currentManagers.map((manager) => (
                <div key={manager.fundManagerId} className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{manager.fundManagerName}</div>
                    <div className="text-xs text-muted-foreground">
                      Since{' '}
                      {new Date(manager.startDate).toLocaleDateString('en-IN', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">No fund managers assigned</div>
            )}
          </CardContent>
        </Card>

        {/* Top Holdings Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <PieChart className="h-5 w-5" />
              Top Holdings
            </CardTitle>
            <CardDescription>
              {holdings.length > 0 ? `Showing top ${Math.min(10, holdings.length)} of ${holdings.length} holdings` : 'No holdings data available'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {topHoldings.length > 0 ? (
              <div className="space-y-3">
                {topHoldings.map((holding, index) => (
                  <div key={holding.id} className="flex items-center gap-3">
                    <div className="w-6 text-center text-xs font-medium text-muted-foreground">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium truncate pr-2">
                          {holding.securityName || holding.securityCode || 'Unknown Security'}
                        </span>
                        <span className="text-sm font-semibold shrink-0">
                          {Number(holding.weight).toFixed(2)}%
                        </span>
                      </div>
                      <Progress value={Number(holding.weight)} className="h-1.5" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground text-center py-8">
                Holdings data not available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Related Schemes */}
      {relatedSchemes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Layers className="h-5 w-5" />
              Related Schemes
            </CardTitle>
            <CardDescription>Other schemes from {fundDetails.amcName}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedSchemes.map((scheme) => (
                <Link
                  key={scheme.mfCode}
                  href={`/fund/${scheme.mfCode}`}
                  className="group flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  {scheme.amcLogo && (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white p-1.5 ring-1 ring-border/50">
                      <Image
                        src={`/amc_logo/${scheme.amcLogo}`}
                        alt="AMC Logo"
                        width={28}
                        height={28}
                        className="object-contain"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                      {scheme.schemeName}
                    </div>
                    {scheme.categoryName && (
                      <div className="text-xs text-muted-foreground">{scheme.categoryName}</div>
                    )}
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
