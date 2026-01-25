import type { MFSchemeTable } from '@finage/core/mfTypes';
import Image from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import Link from 'next/link';

export default function AllSchemesTable({ data }: { data: MFSchemeTable[] }) {
  return (
    <div className="flex justify-center px-6 pt-8">
      <Table>
        <TableHeader>
          <TableRow>
            {/* Empty header for avatar/logo */}
            <TableHead />
            {/* Column header for Scheme */}
            <TableHead>Scheme</TableHead>
            <TableHead>1w</TableHead>
            <TableHead>1m</TableHead>
            <TableHead>3m</TableHead>
            <TableHead>1y</TableHead>
            <TableHead>3y</TableHead>
            <TableHead>5y</TableHead>
            <TableHead>7y</TableHead>
            <TableHead>10y</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((row) => (
            <TableRow key={row.mfCode}>
              <TableCell className="w-16">
                {row.logo ? (
                  <Image
                    src={`/amc_logo/${row.logo}`}
                    alt={row.amcname || 'AMC Logo'}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-muted rounded-full" />
                )}
              </TableCell>

              <TableCell>
                <Link href={`/fund/${row.mfCode}`}>
                  <div className="flex flex-col">
                    <span className="font-bold">{row.schemeName}</span>
                    <span className="text-sm text-muted-foreground">
                      {row.amcname} | {row.schemeCategory}
                    </span>
                  </div>
                </Link>
              </TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
