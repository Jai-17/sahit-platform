import React from "react";
import { Skeleton } from "../ui/skeleton";

const ProfileLoader = () => {
  return (
    <div className="flex gap-10">
      <div className="w-full space-y-4">
        <Skeleton className="h-10 w-80" />
        <Skeleton className="h-10 w-96" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
      <div className="w-full space-y-4">
        <Skeleton className="h-10 w-80" />
        <Skeleton className="h-40 w-40 rounded-full" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
    </div>
  );
};

export default ProfileLoader;
