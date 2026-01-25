import Image from 'next/image';
import Link from 'next/link';
import { Card, CardHeader } from './ui/card';

export default function MyCard({
  amcName,
  amcLogo,
  amcCode,
}: {
  amcName: string;
  amcLogo: string;
  amcCode: number;
}) {
  return (
    <Link href={`/fund-house/${amcCode}`} className="h-full block">
      {/* 
        Card with centered content:
        - h-full: 100% height to fill container
        - min-w-[120px]: minimum width so cards don't get too narrow
      */}
      <Card className="h-full flex flex-col items-center justify-between p-4 min-w-[120px]">
        <Image src={`/amc_logo/${amcLogo}`} alt={amcName} width={50} height={40} />
        <CardHeader className="p-0 text-center w-full">
          <p className="text-sm font-medium line-clamp-2 break-words w-full">{amcName}</p>
        </CardHeader>
      </Card>
    </Link>
  );
}