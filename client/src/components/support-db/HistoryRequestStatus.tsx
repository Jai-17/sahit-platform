"use client";
import React from "react";
import SentRequestTableCard from "./SentRequestTableCard";
import { useGetRequestHistoryQuery } from "@/store/features/protectedApiSlice";

const HistoryRequestStatus = () => {
  const {data, isLoading} = useGetRequestHistoryQuery(undefined);
  console.log(data);

  if(isLoading) return <div>Loading...</div>

  return (
    <div>
      <div className="hidden lg:grid grid-cols-6 mt-10 text-neutral-600 w-full text-sm px-5 lg:px-7 border-b pb-6 mb-2">
        <p>ID</p>
        <p>NGO Name</p>
        <p>Help Type</p>
        <p>Urgency</p>
        <p>Status</p>
        <p>Accepted On</p>
      </div>

      <div className="flex flex-col gap-2">
       {data?.data.map((it:HelpRequest) => <SentRequestTableCard key={it.id} data={it} />)}
      </div>
    </div>
  );
};

export default HistoryRequestStatus;
