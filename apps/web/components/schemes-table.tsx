'use client';

import type { MFSchemeTable } from '@finage/core/mfTypes';
import { ChevronDown, ChevronUp, ChevronsUpDown, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

type SortField = 'schemeName' | 'amcname' | 'schemeCategory';
type SortDirection = 'asc' | 'desc' | null;

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

export interface SchemesTableProps {
  data: MFSchemeTable[];
  title?: string;
  filteredTitle?: string;
  showAmcFilter?: boolean;
  showAmcInSchemeColumn?: boolean;
  searchPlaceholder?: string;
}

export default function SchemesTable({
  data,
  title = 'All Schemes',
  filteredTitle = 'Filtered Results',
  showAmcFilter = true,
  showAmcInSchemeColumn = true,
  searchPlaceholder = 'Search schemes or category...',
}: SchemesTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [amcFilter, setAmcFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(data.map((item) => item.schemeCategory))];
    return uniqueCategories.sort();
  }, [data]);

  const amcs = useMemo(() => {
    const uniqueAmcs = [...new Set(data.map((item) => item.amcname))];
    return uniqueAmcs.sort();
  }, [data]);

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.schemeName.toLowerCase().includes(query) ||
          item.amcname.toLowerCase().includes(query) ||
          item.schemeCategory.toLowerCase().includes(query)
      );
    }

    if (categoryFilter !== 'all') {
      result = result.filter((item) => item.schemeCategory === categoryFilter);
    }

    if (showAmcFilter && amcFilter !== 'all') {
      result = result.filter((item) => item.amcname === amcFilter);
    }

    if (sortField && sortDirection) {
      result.sort((a, b) => {
        const aVal = a[sortField].toLowerCase();
        const bVal = b[sortField].toLowerCase();
        if (sortDirection === 'asc') {
          return aVal.localeCompare(bVal);
        }
        return bVal.localeCompare(aVal);
      });
    }

    return result;
  }, [data, searchQuery, categoryFilter, amcFilter, sortField, sortDirection, showAmcFilter]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  const endIndex = Math.min(startIndex + itemsPerPage, filteredAndSortedData.length);

  const isFiltered = searchQuery || categoryFilter !== 'all' || (showAmcFilter && amcFilter !== 'all');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="size-4 opacity-50" />;
    }
    if (sortDirection === 'asc') {
      return <ChevronUp className="size-4" />;
    }
    return <ChevronDown className="size-4" />;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const resetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setAmcFilter('all');
    setSortField(null);
    setSortDirection(null);
    setCurrentPage(1);
  };

  const generatePageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const showPages = 5;

    if (totalPages <= showPages + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('ellipsis');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('ellipsis');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <TooltipProvider>
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-xl">{isFiltered ? filteredTitle : title}</CardTitle>
              <CardDescription>
                {isFiltered
                  ? `Showing ${startIndex + 1}-${endIndex} of ${filteredAndSortedData.length} filtered schemes`
                  : `${data.length.toLocaleString()} schemes available`}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>

          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>

            <Select
              value={categoryFilter}
              onValueChange={(value) => {
                setCategoryFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {showAmcFilter && (
              <Select
                value={amcFilter}
                onValueChange={(value) => {
                  setAmcFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="AMC" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All AMCs</SelectItem>
                  {amcs.map((amc) => (
                    <SelectItem key={amc} value={amc}>
                      {amc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardHeader>

        <CardContent className="px-0">
          <div className="overflow-x-auto">
            <Table className="table-fixed w-full min-w-[900px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]" />
                  <TableHead className="w-[320px]">
                    <button
                      type="button"
                      onClick={() => handleSort('schemeName')}
                      className="flex items-center gap-1 hover:text-foreground"
                    >
                      Scheme
                      {getSortIcon('schemeName')}
                    </button>
                  </TableHead>
                  <TableHead className="w-[180px]">
                    <button
                      type="button"
                      onClick={() => handleSort('schemeCategory')}
                      className="flex items-center gap-1 hover:text-foreground"
                    >
                      Category
                      {getSortIcon('schemeCategory')}
                    </button>
                  </TableHead>
                  <TableHead className="w-[60px]">1w</TableHead>
                  <TableHead className="w-[60px]">1m</TableHead>
                  <TableHead className="w-[60px]">3m</TableHead>
                  <TableHead className="w-[60px]">1y</TableHead>
                  <TableHead className="w-[60px]">3y</TableHead>
                  <TableHead className="w-[60px]">5y</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                      No schemes found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((row) => (
                    <TableRow key={row.mfCode}>
                      <TableCell className="w-[60px]">
                        {row.logo ? (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white p-1.5 ring-1 ring-border/50">
                            <Image
                              src={`/amc_logo/${row.logo}`}
                              alt={row.amcname || 'AMC Logo'}
                              width={32}
                              height={32}
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-muted" />
                        )}
                      </TableCell>
                      <TableCell className="w-[320px]">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href={`/fund/${row.mfCode}`} className="block hover:underline">
                              <div className="flex flex-col overflow-hidden">
                                <span className="font-medium truncate">{row.schemeName}</span>
                                {showAmcInSchemeColumn && (
                                  <span className="text-sm text-muted-foreground truncate">
                                    {row.amcname}
                                  </span>
                                )}
                              </div>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-sm">
                            <p className="font-medium">{row.schemeName}</p>
                            {showAmcInSchemeColumn && (
                              <p className="text-sm text-muted-foreground">{row.amcname}</p>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="w-[180px]">
                        <span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-xs truncate max-w-full">
                          {row.schemeCategory}
                        </span>
                      </TableCell>
                      <TableCell className="w-[60px]">-</TableCell>
                      <TableCell className="w-[60px]">-</TableCell>
                      <TableCell className="w-[60px]">-</TableCell>
                      <TableCell className="w-[60px]">-</TableCell>
                      <TableCell className="w-[60px]">-</TableCell>
                      <TableCell className="w-[60px]">-</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 0 && (
            <div className="flex items-center justify-between gap-4 border-t px-6 py-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
                <span>Rows per page:</span>
                <Select
                  value={String(itemsPerPage)}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                      <SelectItem key={option} value={String(option)}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span>
                  {startIndex + 1}-{endIndex} of {filteredAndSortedData.length}
                </span>
              </div>

              <Pagination className="mx-0 w-auto">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={
                        currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>

                  {generatePageNumbers().map((page, index) =>
                    page === 'ellipsis' ? (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={
                        currentPage === totalPages
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
