/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from "react";
import StatusTab from "../common/StatusTab";
import { Clock, MapPin } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { formatTimeAgo } from "@/lib/utils";
import { useAcceptRequestUserMutation } from "@/store/features/protectedApiSlice";
import { toast } from "sonner";

const IncomingRequestCard = ({data}:any) => {
  const router = useRouter();
  const [acceptRequestUser] = useAcceptRequestUserMutation();
  const timeAgo = formatTimeAgo(data.updatedAt)
  console.log('COMING FROM INCMOING REQUEST CARD', data);

  async function onSubmit() {
      try {
        await acceptRequestUser({
          ngoId: data.ngo.id,
          requestId: data.helpRequestId,
        }).unwrap();
  
        toast.success("User Approved Successfully!");
        router.push('/');
      } catch (error: any) {
        toast.error("Error Approving User", error);
      }
    }

  return (
    <div className="flex flex-col bg-white drop-shadow-md rounded-xl p-7 gap-4">
      <div className="flex gap-2 justify-between">
        <div className="flex gap-2">
          <StatusTab title="Incoming" color="ORANGE" />
        </div>
        <StatusTab icon={<Clock size={20} />} title={timeAgo} color="GRAY" />
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">{data.ngo.name}</h1>
        <p className="text-neutral-500 truncate w-full">
          {data.ngo.about}
        </p>
      </div>
      <div className="flex gap-2 mt-1">
        <StatusTab
          title="New Delhi"
          color="GRAY"
          icon={<MapPin size={20} />}
        />
        <StatusTab title={`⭐ ${data.ngo.rating}`} color="GRAY" />
        <StatusTab title={`Replies in ${data.ngo.replyTimeMins} Min(s)`} color="GRAY" />
      </div>
      {data.ngo.supportTypes.length > 0 ? (<div className="flex gap-2">{data.ngo.supportTypes.map((data:any) => <StatusTab title={data} key={data} color="WHITE" />)}</div>) : (<div></div>)}
      <div className="flex gap-2 mt-1">
        <Button onClick={onSubmit} className="bg-[#8300EA] h-10 px-7 hover:bg-[#8300EA90] transition duration-200 ease-in cursor-pointer">
          Accept
        </Button>
        <Button
          onClick={() => router.push(`/requests/${data.helpRequestId}/${data.ngo.id}`)}
          variant="outline"
          className="border-[#8300EA] text-[#8300EA] h-10 hover:text-[#8300EA] cursor-pointer duration-200 ease-in transition"
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

export default IncomingRequestCard;
