import type { AmcWithStats } from '@finage/database/actions';
import { Building2, FolderOpen, Layers } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from './ui/card';

interface AmcCardProps {
  amc: AmcWithStats;
}

export default function AmcCard({ amc }: AmcCardProps) {
  return (
    <Link href={`/fund-house/${amc.amcCode}`}>
      <Card className="group h-full overflow-hidden transition-all hover:shadow-lg hover:border-primary/50">
        <div className="p-4 pb-3">
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-muted/80 to-muted p-2">
              {amc.amcLogoName ? (
                <Image
                  src={`/amc_logo/${amc.amcLogoName}`}
                  alt={amc.amcName}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              ) : (
                <Building2 className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {amc.amcName}
            </h3>
          </div>
        </div>

        <div className="flex border-t bg-muted/30">
          <div className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border-r">
            <Layers className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs">
              <span className="font-semibold text-foreground">{amc.schemeCount}</span>
              <span className="text-muted-foreground ml-1">schemes</span>
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center gap-1.5 py-2.5">
            <FolderOpen className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs">
              <span className="font-semibold text-foreground">{amc.categoryCount}</span>
              <span className="text-muted-foreground ml-1">categories</span>
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
