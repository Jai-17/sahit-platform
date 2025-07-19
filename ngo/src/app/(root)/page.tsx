"use client"

import StatsCard from "@/components/common/StatsCard";
import ActiveRequestStatus from "@/components/ngo-db/ActiveRequestStatus";
// import IncomingRequestCard from "@/components/ngo-db/IncomingRequestCard";
import { useGetDBStatsQuery } from "@/store/features/protectedApiSlice";
import { BellIcon, CheckCircle, PlusCircle } from "lucide-react";
import React from "react";

const Page = () => {
  const {data} = useGetDBStatsQuery(undefined);

  return (
    <div>
      <div className="flex w-full justify-between gap-6 px-10">
        <div className="flex-1">
          <StatsCard
            title="Active Request"
            statNumber={data.activeRequests}
            progress={true}
            progressNumber={3}
            icon={<BellIcon size={40} />}
          />
        </div>
        <div className="flex-1">
          <StatsCard
            title="New Request"
            statNumber={data.newRequests}
            progress={true}
            progressNumber={3}
            icon={<CheckCircle size={40} />}
          />
        </div>
        <div className="flex-1">
          <StatsCard
            title="Total Helped"
            statNumber={data.totalHelped}
            progress={true}
            progressNumber={3}
            icon={<PlusCircle size={40} />}
          />
        </div>
      </div>
      <div>
        <h1 className="text-2xl lg:text-3xl font-semibold mb-2 mt-10">
          Request Status
        </h1>
        <p className="text-neutral-500 text-sm lg:text-base">
          Check out your incoming requests and choose them from here
        </p>
        <div className="bg-white shadow-lg/5 rounded-lg p-10 mt-4">
          {/* <IncomingRequestCard /> */}
          No Incoming Requests
        </div>
      </div>
      <div>
        <h1 className="text-2xl lg:text-3xl font-semibold mb-2 mt-10">
          Active Requests
        </h1>
        <p className="text-neutral-500 text-sm lg:text-base">
          Requests that are currently ongoing
        </p>
        <div><ActiveRequestStatus /></div>
      </div>
    </div>
  );
};

export default Page;
