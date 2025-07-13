'use client';

import React from "react";
import StatusTab from "../common/StatusTab";
import { Clock, MapPin } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const IncomingRequestCard = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col bg-white drop-shadow-md rounded-xl p-7 gap-4">
      <div className="flex gap-2 justify-between">
        <div className="flex gap-2">
          <StatusTab title="Incoming" color="ORANGE" />
          <StatusTab title="Legal" color="YELLOW" />
        </div>
        <StatusTab icon={<Clock size={20} />} title="3h Ago" color="GRAY" />
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">Legal Problem</h1>
        <p className="text-neutral-500 truncate w-full">
          Problem in legalities regarding office work and culture facing
          descrimination legalities regarding office work and culture facing
          descrimination.
        </p>
      </div>
      <div className="flex gap-2 mt-1">
        <StatusTab
          title="New Delhi"
          color="WHITE"
          icon={<MapPin size={20} />}
        />
        <StatusTab title="⭐ 4.8" color="GRAY" />
        <StatusTab title="Replies in 2hr" color="GRAY" />
      </div>
      <div className="flex gap-2 mt-1">
        <Button className="bg-[#8300EA] h-10 px-7 hover:bg-[#8300EA90] transition duration-200 ease-in cursor-pointer">
          Accept
        </Button>
        <Button
          onClick={() => router.push('/requests/ngo')}
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
