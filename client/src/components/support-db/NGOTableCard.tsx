"use client";

import { ArrowRight } from "lucide-react";
import React from "react";
import StatusTab from "../common/StatusTab";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

const NGOTableCard = ({ngo}:{ngo: NGO}) => {
  const router = useRouter();

  if(!ngo.user.isAdminApproved) return null;

  return (
    <div onClick={() => router.push(`/ngos/${ngo.id}`)} className="cursor-pointer">
      <div className="relative bg-white mt-7 lg:mt-0 flex justify-between items-start shadow-lg/5 hover:shadow-lg/5 transition duration-300 border border-neutral-200 py-6 px-5 lg:px-7 rounded-lg hover:shadow-lg">
        <div className="grid grid-cols-1 gap-y-4 lg:grid-cols-6 lg:gap-y-0 text-neutral-600 w-full">
          <p>
            <span className="lg:hidden font-semibold text-sm text-black">
              ID:{" "}
            </span>
            <span>{ngo.id.slice(0, 8)}</span>
          </p>
          <p>
            <span className="lg:hidden font-semibold text-sm text-black">
              Name:{" "}
            </span>
            {ngo.name}
          </p>
          <div>
            <span className="lg:hidden font-semibold text-sm text-black">
              Location:{" "}
            </span>
            <StatusTab title={ngo.city} color="ORANGE" />
          </div>
          <div>
            <span className="lg:hidden font-semibold text-sm text-black">
              Rating:{" "}
            </span>
            <StatusTab title={`⭐ ${ngo.rating}`} color="PRIMARY" />
          </div>
          <p>
            <span className="lg:hidden font-semibold text-sm text-black">
              Total Helped:{" "}
            </span>
            {ngo.resolvedHelpRequestCount}
          </p>
          <p className="flex justify-between items-center">
            <span>
              <span className="lg:hidden font-semibold text-sm text-black">
                Joined On:{" "}
              </span>
              {format(new Date(ngo.createdAt), "PPP")}
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

export default NGOTableCard;
