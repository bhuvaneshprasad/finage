import MyCard from '@/components/my-card';
import { getAllAmcs } from '@finage/database/actions';

export default async function AMC() {
  const amcs = await getAllAmcs();

  return (
    <div className="flex pt-28 w-full flex-col">
      <div className='flex justify-center items-center'>
        <span className='text-3xl font-bold uppercase'>Fund Houses</span>
      </div>
      <div className="grid grid-cols-4 gap-8 p-8 w-full">
        {amcs.map((amc) => (
          <MyCard
            key={amc.amcCode}
            amcName={amc.amcName}
            amcLogo={amc.amcLogoName}
            amcCode={amc.amcCode}
          />
        ))}
      </div>
    </div>
  );
}