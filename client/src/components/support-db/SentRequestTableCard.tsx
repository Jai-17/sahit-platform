"use client";

import { ArrowRight } from "lucide-react";
import React from "react";
import StatusTab from "../common/StatusTab";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

const SentRequestTableCard = ({ data }: { data: HelpRequest }) => {
  const router = useRouter();

  return (
    <div>
      <div
        onClick={() =>
          data.status == "IN_PROGRESS"
            ? router.push(`/requests/active/${data.id}`)
            : router.push(`/history/${data.id}/${data.ngoId}`)
        }
        className="bg-white mt-7 lg:mt-0 flex justify-between items-start shadow-lg/5 cursor-pointer hover:shadow-lg/5 transition duration-300 border border-neutral-200 py-6 px-5 lg:px-7 rounded-lg"
      >
        <div className="grid grid-cols-1 gap-y-4 lg:grid-cols-6 lg:gap-y-0 text-neutral-600 w-full">
          <p>
            <span className="lg:hidden font-semibold text-sm text-black">
              ID:{" "}
            </span>
            {`REQ-${data?.id.slice(0, 8)}`}
          </p>
          <p>
            <span className="lg:hidden font-semibold text-sm text-black">
              NGO Name:{" "}
            </span>
            {data?.assignedNGO.name}
          </p>
          <p>
            <span className="lg:hidden font-semibold text-sm text-black">
              Help Type:{" "}
            </span>
            {data?.helpType}
          </p>
          <div>
            <span className="lg:hidden font-semibold text-sm text-black">
              Urgency:{" "}
            </span>
            <StatusTab title={data?.urgency} color="RED" />
          </div>
          <div>
            <span className="lg:hidden font-semibold text-sm text-black">
              Status:{" "}
            </span>
            <StatusTab title={data?.status} />
          </div>
          <p className="flex justify-between items-center">
            <span>
              <span className="lg:hidden font-semibold text-sm text-black">
                Accepted On:{" "}
              </span>
              {format(new Date(data?.submittedAt), "PPP")}
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

export default SentRequestTableCard;
