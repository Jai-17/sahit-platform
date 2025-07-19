import { cn } from "@/lib/utils";
import { ChartColumnDecreasing, ChartColumnIncreasing } from "lucide-react";
import React, { ReactNode } from "react";

interface StatsCardProps {
    title: string,
    statNumber: number,
    progress: boolean,
    progressNumber: number,
    icon: ReactNode,
}

const StatsCard = ({title, statNumber, progress, progressNumber, icon}:StatsCardProps) => {
  return (
    <div className="flex items-center justify-between gap-7 bg-white border border-neutral-200/60 px-10 py-7 rounded-lg shadow-lg/5">
      <div className="gap-2 flex flex-col">
        <p className="font-semibold">{title}</p>
        <h1 className="text-5xl lg:text-6xl font-semibold text-[#8300EA]">{statNumber}</h1>
        <p className={cn('flex gap-2 text-sm lg:text-base', progress ? 'text-green-500' : 'text-red-500')}>
          {progress ? (<ChartColumnIncreasing size={24} />) : (<ChartColumnDecreasing size={24} />)}{" "}{progress ? (`+${progressNumber}% since last week`) : (`-${progressNumber}% since last week`)}
        </p>
      </div>
      <div className="p-4 bg-[#A635FF] rounded-2xl text-white">
        {icon}
      </div>
    </div>
  );
};

export default StatsCard;
