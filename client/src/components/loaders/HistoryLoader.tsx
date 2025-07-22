import React from "react";
import { Skeleton } from "../ui/skeleton";

const HistoryLoader = () => {
  return (
    <div className="flex flex-col gap-2 mt-10">
      <Skeleton className="h-20" />
      <Skeleton className="h-20" />
      <Skeleton className="h-20" />
      <Skeleton className="h-20" />
      <Skeleton className="h-20" />
      <Skeleton className="h-20" />
    </div>
  );
};

export default HistoryLoader;
