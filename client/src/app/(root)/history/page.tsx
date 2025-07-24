"use client"

import HistoryRequestStatus from "@/components/support-db/HistoryRequestStatus";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import React from "react";

const HistoryPage = () => {
  return (
    <div>
      <div className="flex flex-col md:flex-row items-baseline justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold mb-2">
            Request Status
          </h1>
          <p className="text-neutral-500 text-sm lg:text-base">
            Check out your incoming requests and choose them from here
          </p>
        </div>
        <Button onClick={() => redirect('/new-request')} className="bg-[#8300EA] px-9 py-5 hover:bg-[#8300EA90] mt-5 md:mt-0 cursor-pointer">New Request</Button>
      </div>
      <div>
        <HistoryRequestStatus />
      </div>
    </div>
  );
};

export default HistoryPage;
