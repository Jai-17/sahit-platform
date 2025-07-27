/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import InfoCard from "@/components/common/InfoCard";
import StatusTab from "@/components/common/StatusTab";
import { Button } from "@/components/ui/button";
import { useDeleteHelpRequestMutation, useGetActiveHelpRequestDetailsQuery } from "@/store/features/protectedApiSlice";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const Page = () => {
  const { data, isLoading } = useGetActiveHelpRequestDetailsQuery(undefined);
  const [deleteHelpRequest] = useDeleteHelpRequestMutation();
  const router = useRouter();
  if (isLoading) return <div>Loading...</div>

  async function onDelete() {
    try {
      deleteHelpRequest(data.data.id).unwrap();
      toast.success("Deleted Help Request");
      router.push('/');
    } catch (error:any) {
      toast.error("Error deleting Request", error);
    }
  }
  console.log(data?.data);
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold mb-2">
            Current Pending Request
          </h1>
          <p className="text-neutral-500 text-sm lg:text-base">
            View the details of your current pending request
          </p>
        </div>
        {data.data.status === "DECLINED_BY_ALL" && <div className="flex flex-col items-end gap-2">
          <p>Delete Request and send a new one?</p>
            <Button onClick={onDelete} className="bg-red-500 h-10 px-7 hover:bg-red-400 transition duration-200 ease-in cursor-pointer">Delete Request</Button>
          </div>}
      </div>
      <div className="mt-5 flex flex-col md:flex-row gap-2">
        <StatusTab title={data.data.helpType} color="ORANGE" />
        <StatusTab title={data.data.urgency} color="RED" />
        <StatusTab title={data.data.status} color="PRIMARY" />
      </div>
      <div className="mt-5">
        <InfoCard heading={data.data.title}>
            {data.data.description}
        </InfoCard>
      </div>
    </div>
  );
};

export default Page;
