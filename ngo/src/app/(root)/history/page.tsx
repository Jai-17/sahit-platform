"use client";

import HistoryRequestStatus from "@/components/ngo-db/HistoryRequestStatus";
import { useGetAllHelpRequestQuery } from "@/store/features/protectedApiSlice";
import React from "react";

const HistoryPage = () => {
  const { data } = useGetAllHelpRequestQuery(undefined);
  console.log(data);

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold mb-2">
            All Requests
          </h1>
          <p className="text-neutral-500 text-sm lg:text-base">
            Check out all of the help requests you have accepted
          </p>
        </div>
      </div>
      <div><HistoryRequestStatus /></div>
    </div>
  );
};

export default HistoryPage;
