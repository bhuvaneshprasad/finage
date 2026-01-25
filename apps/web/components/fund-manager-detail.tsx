'use client';

import type {
  CoManager,
  FundManagerDetailStats,
  FundManagerScheme,
  SharedScheme,
} from '@finage/database/actions';
import {
  ArrowUpRight,
  Briefcase,
  Calendar,
  ChevronLeft,
  ChevronRight,
  History,
  TrendingUp,
  User,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface FundManagerDetailProps {
  manager: {
    fundManagerId: number;
    fundManagerName: string;
    gender: string | null;
  };
  stats: FundManagerDetailStats;
  schemes: FundManagerScheme[];
  currentAmc: string | null;
  experience: string | null;
  firstStartDate: Date | null;
  coManagers: CoManager[];
  sharedSchemesMap: Record<number, SharedScheme[]>;
}

const ITEMS_PER_PAGE = 8;

export default function FundManagerDetail({
  manager,
  stats,
  schemes,
  currentAmc,
  experience,
  firstStartDate,
  coManagers,
  sharedSchemesMap,
}: FundManagerDetailProps) {
  const [selectedCoManager, setSelectedCoManager] = useState<CoManager | null>(null);
  const [activeCurrentPage, setActiveCurrentPage] = useState(1);
  const [activePastPage, setActivePastPage] = useState(1);
  const [coManagerPage, setCoManagerPage] = useState(1);

  const activeSchemes = schemes.filter((s) => s.isCurrent);
  const pastSchemes = schemes.filter((s) => !s.isCurrent);

  // Pagination for active schemes
  const activeTotalPages = Math.ceil(activeSchemes.length / ITEMS_PER_PAGE);
  const paginatedActiveSchemes = activeSchemes.slice(
    (activeCurrentPage - 1) * ITEMS_PER_PAGE,
    activeCurrentPage * ITEMS_PER_PAGE
  );

  // Pagination for past schemes
  const pastTotalPages = Math.ceil(pastSchemes.length / ITEMS_PER_PAGE);
  const paginatedPastSchemes = pastSchemes.slice(
    (activePastPage - 1) * ITEMS_PER_PAGE,
    activePastPage * ITEMS_PER_PAGE
  );

  // Pagination for co-managers
  const coManagerTotalPages = Math.ceil(coManagers.length / ITEMS_PER_PAGE);
  const paginatedCoManagers = coManagers.slice(
    (coManagerPage - 1) * ITEMS_PER_PAGE,
    coManagerPage * ITEMS_PER_PAGE
  );

  const sharedSchemes = selectedCoManager ? sharedSchemesMap[selectedCoManager.fundManagerId] || [] : [];

  return (
    <div className="flex flex-col gap-6 pt-28 px-6 mx-auto max-w-7xl pb-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-primary">
          <User className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{manager.fundManagerName}</h1>
          <p className="text-muted-foreground">
            Fund Manager{currentAmc && <span> at {currentAmc}</span>}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs">Currently Managing</span>
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.activeSchemeCount}
            </div>
            <div className="text-xs text-muted-foreground">schemes</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <History className="h-4 w-4" />
              <span className="text-xs">Previously Managed</span>
            </div>
            <div className="text-2xl font-bold">{stats.pastSchemeCount}</div>
            <div className="text-xs text-muted-foreground">schemes</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Briefcase className="h-4 w-4" />
              <span className="text-xs">Total Funds</span>
            </div>
            <div className="text-2xl font-bold">{stats.totalSchemeCount}</div>
            <div className="text-xs text-muted-foreground">managed</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Calendar className="h-4 w-4" />
              <span className="text-xs">Experience</span>
            </div>
            <div className="text-2xl font-bold">{experience || '-'}</div>
            <div className="text-xs text-muted-foreground">
              {firstStartDate && (
                <>
                  since{' '}
                  {new Date(firstStartDate).toLocaleDateString('en-IN', {
                    month: 'short',
                    year: 'numeric',
                  })}
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Users className="h-4 w-4" />
              <span className="text-xs">Status</span>
            </div>
            <div className="mt-1">
              {stats.activeSchemeCount > 0 ? (
                <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20">
                  Active
                </Badge>
              ) : (
                <Badge variant="secondary">Inactive</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

        {/* Main Content */}
        <TooltipProvider>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
            {/* Schemes Tabs */}
            <div className="lg:col-span-3 flex">
              <Tabs defaultValue="active" className="w-full flex flex-col">
                <Card className="flex flex-col flex-1">
                  <TabsList className="w-full rounded-none bg-transparent p-0 h-auto border-b">
                    <TabsTrigger value="active" className="flex-1 gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-2.5">
                      <TrendingUp className="h-4 w-4" />
                      Currently Managing ({activeSchemes.length})
                    </TabsTrigger>
                    <TabsTrigger value="past" className="flex-1 gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-2.5">
                      <History className="h-4 w-4" />
                      Previously Managed ({pastSchemes.length})
                    </TabsTrigger>
                  </TabsList>

                <TabsContent value="active" className="mt-0 flex-1 flex flex-col">
                  <CardContent className="p-0 flex-1 flex flex-col">
                    {activeSchemes.length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground">
                        No active schemes
                      </div>
                    ) : (
                      <>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[50px]"></TableHead>
                              <TableHead className="w-[40%]">Scheme</TableHead>
                              <TableHead className="hidden md:table-cell">Category</TableHead>
                              <TableHead className="hidden sm:table-cell w-[100px]">Since</TableHead>
                              <TableHead className="w-[40px]"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {paginatedActiveSchemes.map((scheme) => (
                              <TableRow key={scheme.mfCode}>
                                <TableCell className="w-[50px]">
                                  {scheme.amcLogo && (
                                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white p-1 ring-1 ring-border/50">
                                      <Image
                                        src={`/amc_logo/${scheme.amcLogo}`}
                                        alt={scheme.amcName}
                                        width={24}
                                        height={24}
                                        className="object-contain"
                                      />
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell className="max-w-0">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="truncate font-medium text-sm cursor-default">
                                        {scheme.schemeName}
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="max-w-md">
                                      <p>{scheme.schemeName}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                  <div className="text-xs text-muted-foreground truncate">
                                    {scheme.amcName}
                                  </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  <Badge variant="outline" className="text-xs whitespace-nowrap">
                                    {scheme.categoryName || 'N/A'}
                                  </Badge>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell text-sm text-muted-foreground whitespace-nowrap">
                                  {new Date(scheme.startDate).toLocaleDateString('en-IN', {
                                    month: 'short',
                                    year: 'numeric',
                                  })}
                                </TableCell>
                                <TableCell>
                                  <Link
                                    href={`/fund/${scheme.mfCode}`}
                                    className="text-muted-foreground hover:text-primary"
                                  >
                                    <ArrowUpRight className="h-4 w-4" />
                                  </Link>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        {/* Pagination */}
                        <div className="flex items-center justify-end gap-2 px-3 py-2 border-t mt-auto">
                          <span className="text-xs text-muted-foreground">
                            {(activeCurrentPage - 1) * ITEMS_PER_PAGE + 1}-
                            {Math.min(activeCurrentPage * ITEMS_PER_PAGE, activeSchemes.length)} of{' '}
                            {activeSchemes.length}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => setActiveCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={activeCurrentPage === 1}
                          >
                            <ChevronLeft className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() =>
                              setActiveCurrentPage((p) => Math.min(activeTotalPages, p + 1))
                            }
                            disabled={activeCurrentPage === activeTotalPages}
                          >
                            <ChevronRight className="h-3 w-3" />
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </TabsContent>

              <TabsContent value="past" className="mt-0 flex-1 flex flex-col">
                <CardContent className="p-0 flex-1 flex flex-col">
                  {pastSchemes.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      No past schemes
                    </div>
                  ) : (
                    <>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead className="w-[40%]">Scheme</TableHead>
                            <TableHead className="hidden md:table-cell">Category</TableHead>
                            <TableHead className="hidden sm:table-cell w-[120px]">Period</TableHead>
                            <TableHead className="w-[40px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedPastSchemes.map((scheme) => (
                            <TableRow
                              key={`${scheme.mfCode}-${scheme.startDate}`}
                              className="opacity-75"
                            >
                              <TableCell className="w-[50px]">
                                {scheme.amcLogo && (
                                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white p-1 ring-1 ring-border/50">
                                    <Image
                                      src={`/amc_logo/${scheme.amcLogo}`}
                                      alt={scheme.amcName}
                                      width={24}
                                      height={24}
                                      className="object-contain"
                                    />
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="max-w-0">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="truncate font-medium text-sm cursor-default">
                                      {scheme.schemeName}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="max-w-md">
                                    <p>{scheme.schemeName}</p>
                                  </TooltipContent>
                                </Tooltip>
                                <div className="text-xs text-muted-foreground truncate">
                                  {scheme.amcName}
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                <Badge variant="outline" className="text-xs whitespace-nowrap">
                                  {scheme.categoryName || 'N/A'}
                                </Badge>
                              </TableCell>
                              <TableCell className="hidden sm:table-cell text-xs text-muted-foreground whitespace-nowrap">
                                {new Date(scheme.startDate).toLocaleDateString('en-IN', {
                                  month: 'short',
                                  year: 'numeric',
                                })}
                                {' - '}
                                {scheme.endDate
                                  ? new Date(scheme.endDate).toLocaleDateString('en-IN', {
                                      month: 'short',
                                      year: 'numeric',
                                    })
                                  : 'N/A'}
                              </TableCell>
                              <TableCell>
                                <Link
                                  href={`/fund/${scheme.mfCode}`}
                                  className="text-muted-foreground hover:text-primary"
                                >
                                  <ArrowUpRight className="h-4 w-4" />
                                </Link>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      {/* Pagination */}
                      <div className="flex items-center justify-end gap-2 px-3 py-2 border-t mt-auto">
                        <span className="text-xs text-muted-foreground">
                          {(activePastPage - 1) * ITEMS_PER_PAGE + 1}-
                          {Math.min(activePastPage * ITEMS_PER_PAGE, pastSchemes.length)} of{' '}
                          {pastSchemes.length}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => setActivePastPage((p) => Math.max(1, p - 1))}
                          disabled={activePastPage === 1}
                        >
                          <ChevronLeft className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() =>
                            setActivePastPage((p) => Math.min(pastTotalPages, p + 1))
                          }
                          disabled={activePastPage === pastTotalPages}
                        >
                          <ChevronRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </TabsContent>
            </Card>
          </Tabs>
        </div>

          {/* Co-managers Sidebar */}
          <div className="lg:col-span-1 flex">
            <Card className="flex flex-col flex-1">
              <div className="flex items-center gap-2 px-3 py-2.5 border-b">
                <Users className="h-4 w-4 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">Worked With</div>
                  <div className="text-xs text-muted-foreground">Click to see funds</div>
                </div>
              </div>
              <div className="flex-1 divide-y">
                {paginatedCoManagers.length === 0 ? (
                  <>
                    {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                      <div key={`empty-${i}`} className="h-[53px]" />
                    ))}
                  </>
                ) : (
                  <>
                    {paginatedCoManagers.map((cm) => (
                      <button
                        key={cm.fundManagerId}
                        onClick={() => setSelectedCoManager(cm)}
                        className="w-full flex items-center gap-3 px-3 h-[53px] hover:bg-muted/50 transition-colors text-left"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <User className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="font-medium text-sm truncate cursor-default">
                                {cm.fundManagerName}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="left">
                              <p>{cm.fundManagerName}</p>
                            </TooltipContent>
                          </Tooltip>
                          <div className="text-xs text-muted-foreground">
                            {cm.sharedSchemeCount} funds
                          </div>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </button>
                    ))}
                    {/* Empty rows to maintain consistent height */}
                    {Array.from({ length: ITEMS_PER_PAGE - paginatedCoManagers.length }).map(
                      (_, i) => (
                        <div key={`empty-${i}`} className="h-[53px]" />
                      )
                    )}
                  </>
                )}
              </div>
              {/* Co-manager Pagination */}
              <div className="flex items-center justify-end gap-2 px-3 py-2 border-t mt-auto">
                <span className="text-xs text-muted-foreground">
                  {coManagers.length > 0
                    ? `${(coManagerPage - 1) * ITEMS_PER_PAGE + 1}-${Math.min(
                        coManagerPage * ITEMS_PER_PAGE,
                        coManagers.length
                      )} of ${coManagers.length}`
                    : '0 of 0'}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setCoManagerPage((p) => Math.max(1, p - 1))}
                  disabled={coManagerPage === 1 || coManagers.length === 0}
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setCoManagerPage((p) => Math.min(coManagerTotalPages, p + 1))}
                  disabled={coManagerPage === coManagerTotalPages || coManagers.length === 0}
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </TooltipProvider>

      {/* Shared Schemes Sheet */}
      <Sheet open={!!selectedCoManager} onOpenChange={() => setSelectedCoManager(null)}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-base">
              <Users className="h-5 w-5 shrink-0" />
              Funds Managed Together
            </SheetTitle>
            <SheetDescription>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-medium text-foreground">{manager.fundManagerName}</span>
                <span className="text-muted-foreground">&</span>
                <span className="font-medium text-foreground">{selectedCoManager?.fundManagerName}</span>
              </div>
              <div className="text-muted-foreground mt-1">{sharedSchemes.length} shared funds</div>
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 min-h-0 overflow-y-auto -mx-4 px-4">
            <div className="space-y-2 pb-4">
              {sharedSchemes.map((scheme) => (
                <Link
                  key={scheme.mfCode}
                  href={`/fund/${scheme.mfCode}`}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  {scheme.amcLogo && (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white p-1.5 ring-1 ring-border/50">
                      <Image
                        src={`/amc_logo/${scheme.amcLogo}`}
                        alt={scheme.amcName}
                        width={28}
                        height={28}
                        className="object-contain"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm line-clamp-2">{scheme.schemeName}</div>
                    <div className="text-xs text-muted-foreground">{scheme.amcName}</div>
                    {scheme.categoryName && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        {scheme.categoryName}
                      </Badge>
                    )}
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </Link>
              ))}
            </div>
          </div>
          {selectedCoManager && (
            <div className="border-t p-4">
              <Link
                href={`/fund-managers/${selectedCoManager.fundManagerId}`}
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                View {selectedCoManager.fundManagerName}'s profile
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
