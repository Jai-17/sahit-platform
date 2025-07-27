"use client";
import React from "react";
import SentRequestTableCard from "./SentRequestTableCard";
import { useGetAllHelpRequestQuery } from "@/store/features/protectedApiSlice";
import HistoryLoader from "../loaders/HistoryLoader";

const HistoryRequestStatus = () => {
  const {data, isLoading} = useGetAllHelpRequestQuery(undefined);
  console.log(data);

  if(isLoading) return <HistoryLoader />

  return (
    <>{data.data.length === 0 ? <div className="text-2xl mt-5 font-semibold text-neutral-400">No Help Requests yet!</div> : <div>
      <div className="hidden lg:grid grid-cols-6 mt-10 text-neutral-600 w-full text-sm px-5 lg:px-7 border-b pb-6 mb-2">
        <p>ID</p>
        <p>Name/Alias</p>
        <p>Help Type</p>
        <p>Urgency</p>
        <p>Status</p>
        <p>Created On</p>
      </div>

      <div className="flex flex-col gap-2">
       {data?.data.map((it:HelpRequest) => <SentRequestTableCard key={it.id} data={it} />)}
      </div>
    </div>}</>
  );
};

export default HistoryRequestStatus;
