"use client";

import StatsCard from "@/components/common/StatsCard";
import HomeLoader from "@/components/loaders/HomeLoader";
import ActiveRequestStatus from "@/components/ngo-db/ActiveRequestStatus";
import IncomingRequestCard from "@/components/ngo-db/IncomingRequestCard";
// import IncomingRequestCard from "@/components/ngo-db/IncomingRequestCard";
import {
  useGetDBStatsQuery,
  useIncomingRequestQuery,
} from "@/store/features/protectedApiSlice";
import { BellIcon, CheckCircle, PlusCircle } from "lucide-react";
import React from "react";

const Page = () => {
  const { data, isLoading } = useGetDBStatsQuery(undefined);
  const { data: incomingRequests, isLoading: loadingIncomingRequests } =
    useIncomingRequestQuery(undefined);
  if (isLoading) return <HomeLoader />;
  console.log('INCOMING REQUEST ROOT', incomingRequests);

  return (
    <div>
      <div className="flex flex-col lg:flex-row w-full justify-between gap-6 lg:px-10">
        <div className="flex-1">
          <StatsCard
            title="Active Request"
            statNumber={data?.activeRequests}
            progress={true}
            progressNumber={3}
            icon={<BellIcon size={40} />}
          />
        </div>
        <div className="flex-1">
          <StatsCard
            title="New Request"
            statNumber={data?.newRequests}
            progress={true}
            progressNumber={3}
            icon={<CheckCircle size={40} />}
          />
        </div>
        <div className="flex-1">
          <StatsCard
            title="Total Helped"
            statNumber={data?.totalHelped}
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
        <div className="bg-white shadow-lg/5 rounded-lg px-10 pb-10 pt-5 mt-4">
          {loadingIncomingRequests ? (
            <div>Loading...</div>
          ) : incomingRequests.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-7 gap-4">
              {incomingRequests.data.slice(0, 3).map((data: IncomingRequest) => (
                <IncomingRequestCard key={data.helpRequest.id} incomingRequest={data} />
              ))}
            </div>
          ) : (
            <div className="mt-5 text-2xl font-semibold text-neutral-400">
              No Incoming Requests for now
            </div>
          )}
        </div>
      </div>
      <div>
        <h1 className="text-2xl lg:text-3xl font-semibold mb-2 mt-10">
          Active Requests
        </h1>
        <p className="text-neutral-500 text-sm lg:text-base">
          Requests that are currently ongoing
        </p>
        <div>
          <ActiveRequestStatus />
        </div>
      </div>
    </div>
  );
};

export default Page;
