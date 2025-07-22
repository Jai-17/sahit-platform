import React from "react";
import { Skeleton } from "../ui/skeleton";

const HomeLoader = () => {
  return (
    <div className="flex flex-col gap-5">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-5 w-[200px]" />
      <Skeleton className="h-5 w-[400px]" />
      <div className="flex flex-col lg:flex-row gap-5">
        <Skeleton className="h-40 flex-1" />
        <Skeleton className="h-40 flex-1" />
        <Skeleton className="h-40 flex-1" />
        <Skeleton className="h-40 flex-1" />
      </div>
      <Skeleton className="h-5 w-[200px]" />
      <Skeleton className="h-5 w-[400px]" />
      <div className="flex flex-col lg:flex-row gap-5">
        <Skeleton className="h-40 flex-1" />
        <Skeleton className="h-40 flex-1" />
        <Skeleton className="h-40 flex-1" />
        <Skeleton className="h-40 flex-1" />
      </div>
    </div>
  );
};

export default HomeLoader;
