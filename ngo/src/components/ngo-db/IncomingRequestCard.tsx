'use client';

import React from "react";
import StatusTab from "../common/StatusTab";
import { Clock, MapPin } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { formatTimeAgo } from "@/lib/utils";

const IncomingRequestCard = ({helpRequest}:{helpRequest:HelpRequest}) => {
  const router = useRouter();
  const timeAgo = formatTimeAgo(helpRequest.submittedAt)

  return (
    <div className="flex flex-col bg-white drop-shadow-md rounded-xl p-7 gap-4">
      <div className="flex gap-2 justify-between">
        <div className="flex gap-2">
          <StatusTab title="Incoming" color="ORANGE" />
          <StatusTab title={helpRequest.helpType} color="YELLOW" />
        </div>
        <StatusTab icon={<Clock size={20} />} title={timeAgo} color="GRAY" />
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold truncate w-full">{helpRequest.title}</h1>
        <p className="text-neutral-500">
          {helpRequest.description}
        </p>
      </div>
      <div className="flex gap-2 mt-1">
        <StatusTab
          title={helpRequest.user.city}
          color="WHITE"
          icon={<MapPin size={20} />}
        />
        <StatusTab title={helpRequest.urgency} color={helpRequest.urgency == "HIGH" || helpRequest.urgency == "URGENT" ? "RED" : (helpRequest.urgency == "MEDIUM" ? "ORANGE" : "YELLOW")} />
      </div>
      <div className="flex gap-2 mt-1">
        <Button className="bg-[#8300EA] h-10 px-7 hover:bg-[#8300EA90] transition duration-200 ease-in cursor-pointer">
          Accept
        </Button>
        <Button
          onClick={() => router.push(`/requests/${helpRequest.id}`)}
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
