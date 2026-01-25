'use client';

import { Briefcase, Building2, History, Search, User } from 'lucide-react';
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

export interface FundManager {
  fundManagerId: number;
  fundManagerName: string;
  gender: string | null;
  activeSchemeCount: number;
  pastSchemeCount: number;
  currentAmcName: string | null;
}

interface FundManagersGridProps {
  data: FundManager[];
  totalUniqueSchemes: number;
}

const ITEMS_PER_PAGE_OPTIONS = [12, 24, 48, 96];

export default function FundManagersGrid({ data, totalUniqueSchemes }: FundManagersGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [amcFilter, setAmcFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);

  // Get unique AMCs for filter
  const amcs = useMemo(() => {
    const uniqueAmcs = [...new Set(data.map((m) => m.currentAmcName).filter(Boolean))] as string[];
    return uniqueAmcs.sort();
  }, [data]);

  // Filter and sort data
  const filteredData = useMemo(() => {
    let result = [...data];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.fundManagerName.toLowerCase().includes(query) ||
          (m.currentAmcName && m.currentAmcName.toLowerCase().includes(query))
      );
    }

    // Status filter
    if (statusFilter === 'active') {
      result = result.filter((m) => m.activeSchemeCount > 0);
    } else if (statusFilter === 'inactive') {
      result = result.filter((m) => m.activeSchemeCount === 0);
    }

    // AMC filter
    if (amcFilter !== 'all') {
      result = result.filter((m) => m.currentAmcName === amcFilter);
    }

    return result;
  }, [data, searchQuery, statusFilter, amcFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
  const endIndex = Math.min(startIndex + itemsPerPage, filteredData.length);

  const isFiltered = searchQuery || statusFilter !== 'all' || amcFilter !== 'all';

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setAmcFilter('all');
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

  const activeManagersCount = data.filter((m) => m.activeSchemeCount > 0).length;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-xl">
              {isFiltered ? 'Filtered Results' : 'All Fund Managers'}
            </CardTitle>
            <CardDescription>
              {isFiltered
                ? `Showing ${startIndex + 1}-${endIndex} of ${filteredData.length} fund managers`
                : `${data.length} fund managers • ${activeManagersCount} active • ${totalUniqueSchemes.toLocaleString()} schemes`}
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
              placeholder="Search by name or AMC..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9"
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

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
        </div>
      </CardHeader>

      <CardContent>
        {paginatedData.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-muted-foreground">
            No fund managers found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedData.map((manager) => (
              <Link key={manager.fundManagerId} href={`/fund-managers/${manager.fundManagerId}`}>
                <Card className="group h-full p-4 transition-all hover:shadow-lg hover:border-primary/50">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-primary">
                      <User className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                        {manager.fundManagerName}
                      </h3>
                      {manager.currentAmcName ? (
                        <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                          <Building2 className="h-3 w-3 shrink-0" />
                          <span className="truncate">{manager.currentAmcName}</span>
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground mt-0.5">Fund Manager</div>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Briefcase className="h-3 w-3" />
                          <span>
                            {manager.activeSchemeCount > 0 ? (
                              <span className="text-foreground font-medium">
                                {manager.activeSchemeCount}
                              </span>
                            ) : (
                              <span>0</span>
                            )}{' '}
                            active
                          </span>
                        </div>
                        {manager.pastSchemeCount > 0 && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <History className="h-3 w-3" />
                            <span>{manager.pastSchemeCount} past</span>
                          </div>
                        )}
                      </div>
                      {manager.activeSchemeCount > 0 && (
                        <span className="inline-flex items-center mt-2 px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-600 dark:text-green-400">
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 0 && (
          <div className="flex items-center justify-between gap-4 border-t mt-6 pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
              <span>Per page:</span>
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
                {filteredData.length > 0 ? `${startIndex + 1}-${endIndex}` : '0'} of{' '}
                {filteredData.length}
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
                      currentPage === totalPages || totalPages === 0
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
  );
}
