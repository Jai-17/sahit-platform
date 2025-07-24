import React from "react";
import { Skeleton } from "../ui/skeleton";

const RequestLoader = () => {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <Skeleton className="h-4 mb-5 w-[200px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
      <div className="flex flex-col md:flex-row justify-between gap-5">
        <Skeleton className="h-[300px] md:h-[400px] w-full md:flex-1" />
        <Skeleton className="h-[300px] md:h-[400px] w-full md:flex-1" />
        <Skeleton className="h-[400px] flex-1" />
      </div>
    </div>
  );
};

export default RequestLoader;
