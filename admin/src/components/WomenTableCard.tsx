"use client";

import { ArrowRight } from "lucide-react";
import React from "react";
import StatusTab from "./StatusTab";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

const WomenTableCard = ({ women }: { women: Women }) => {
  const router = useRouter();
  return (
    <div onClick={() => router.push(`/help-seeker/${women.id}`)} className="cursor-pointer">
      <div className="relative bg-white mt-7 lg:mt-0 flex justify-between items-start shadow-lg/5 hover:shadow-lg/5 transition duration-300 border border-neutral-200 py-6 px-5 lg:px-7 rounded-lg hover:shadow-lg">
        {!women.user.isAdminApproved && (
          <div className="absolute top-0 left-0 flex items-center gap-1 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
            <span className="w-2 h-2 bg-red-600 rounded-full"></span>
            Not Approved
          </div>
        )}

        <div className="grid grid-cols-1 gap-y-4 lg:grid-cols-6 lg:gap-y-0 text-neutral-600 w-full">
          <p>
            <span className="lg:hidden font-semibold text-sm text-black">
              ID:{" "}
            </span>
            <span>{women.id.slice(0, 8)}</span>
          </p>
          <p>
            <span className="lg:hidden font-semibold text-sm text-black">
              Name:{" "}
            </span>
            {women.name}
          </p>
          <div>
            <span className="lg:hidden font-semibold text-sm text-black">
              Help Status:{" "}
            </span>
            <StatusTab
              title={(women.helpRequests.length > 0 && women.helpRequests[0].staus != "RESOLVED") ? women.helpRequests[0].status : "Inactive"}
              color={(women.helpRequests.length > 0 && women.helpRequests[0].staus != "RESOLVED") ? "PRIMARY" : "GRAY"}
            />
          </div>
          <div>
            <span className="lg:hidden font-semibold text-sm text-black">
              Location:{" "}
            </span>
            <StatusTab title={women.city} color="ORANGE" />
          </div>
          <p>
            <span className="lg:hidden font-semibold text-sm text-black">
              Total Requests:{" "}
            </span>
            {women._count.helpRequests}
          </p>
          <p className="flex justify-between items-center">
            <span>
              <span className="lg:hidden font-semibold text-sm text-black">
                Joined On:{" "}
              </span>
              {format(new Date(women.createdAt), "PPP")}
            </span>
            <ArrowRight
              className="text-[#8300EA] shrink-0 ml-2 lg:ml-0"
              size={20}
            />
          </p>
        </div>
      </div>
    </div>
  );
};

export default WomenTableCard;
