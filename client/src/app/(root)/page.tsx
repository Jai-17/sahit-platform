/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import StatsCard from "@/components/common/StatsCard";
import IncomingRequestCard from "@/components/support-db/IncomingRequestCard";
import SentRequestStatus from "@/components/support-db/SentRequestStatus";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetAcceptedRequestByNGOQuery,
  useGetActiveHelpRequestQuery,
  useGetHelpRequestCountQuery,
} from "@/store/features/protectedApiSlice";
import { BellIcon } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";

const HomePage = () => {
  const { data: incomingRequest, isLoading: isLoadingIncomingRequest } =
    useGetAcceptedRequestByNGOQuery(undefined);
  const { data: activeRequest, isLoading: isLoadingActiveRequest } =
    useGetActiveHelpRequestQuery(undefined);
  const {data: countRequest, isLoading: countLoading} = useGetHelpRequestCountQuery(undefined);

  return (
    <>
      {/* Top Cards Stats */}
      <div className="flex flex-col lg:flex-row gap-5">
        <div className="flex-1 shadow-lg/5">
          <div className="h-full relative rounded-lg overflow-hidden">
            <div className="relative h-full bg-[url('/support-bg.png')] bg-cover bg-center text-white p-6 rounded-lg">
              <p>Here to Connect you with Help!</p>
              <h2 className="text-xl 2xl:text-2xl font-semibold mt-2">
                Hey, you have 1 new notification and 2 new requests.
              </h2>
              <Button onClick={() => redirect('/new-request')} className="bg-white text-black px-10 py-5 mt-5 cursor-pointer hover:bg-neutral-200 transition-colors ease-in-out duration-300">
                New Request
              </Button>
            </div>
          </div>
        </div>

        <div className="h-full">
         <StatsCard title="Total Requests" statNumber={countLoading ? "..." : countRequest?.data.count} progress={true} progressNumber={3} icon={<BellIcon size={40} />}  />
        </div>
      </div>

      {/* Notifications Panel */}
      <div className="bg-white shadow-lg/5 p-7 rounded-lg mt-7 flex flex-col gap-5">
        <h1 className="text-xl lg:text-3xl font-semibold">
          Latest Notifications 🔔
        </h1>
        <p className="text-neutral-700">
          1 New Chat Request from Kalam NGO. Check out now!
        </p>
      </div>

      {/* Request Status */}
      <h1 className="text-2xl lg:text-3xl font-semibold mb-2 mt-10">
        Request Status
      </h1>
      <p className="text-neutral-500 text-sm lg:text-base">
        Check out your incoming requests and choose them from here
      </p>

      <div className="bg-white mt-5 p-5 rounded-lg">
        {(isLoadingActiveRequest ? <div><Skeleton className="h-20" /></div> : 
          activeRequest?.data ? (
            <>
              <h1 className="text-2xl font-semibold">Active Requests</h1>
              <div className="px-6">
                <SentRequestStatus data={activeRequest.data} />
              </div>
            </>
          ) : <div>No Active Request</div>
        )}
        {(isLoadingIncomingRequest ? <div><Skeleton className="mt-10 h-20" /></div> :
          incomingRequest?.data.length > 0 && (
            <>
              <h1 className="text-2xl font-semibold">Incoming Requests</h1>(
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-7 gap-4">
                {incomingRequest.data.map((data: any) => (
                  <IncomingRequestCard key={data.id} data={data} />
                ))}
              </div>
              )
            </>
          )
        )}
      </div>
    </>
  );
};

export default HomePage;
