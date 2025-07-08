import { ArrowRight } from "lucide-react";
import React from "react";

const SentRequestTableCard = () => {
  return (
    <div>
      <div className="mt-7 lg:mt-0 flex justify-between items-start shadow-lg/5 hover:shadow-lg/5 transition duration-300 border border-neutral-200 py-6 px-5 lg:px-7 rounded-lg">
        <div className="grid grid-cols-1 gap-y-4 lg:grid-cols-6 lg:gap-y-0 text-neutral-600 w-full">
          <p>
            <span className="lg:hidden font-semibold text-sm text-black">
              ID:{" "}
            </span>
            1701
          </p>
          <p>
            <span className="lg:hidden font-semibold text-sm text-black">
              NGO Name:{" "}
            </span>
            Kalam Foundation
          </p>
          <p>
            <span className="lg:hidden font-semibold text-sm text-black">
              Help Type:{" "}
            </span>
            Legal
          </p>
          <p>
            <span className="lg:hidden font-semibold text-sm text-black">
              Urgency:{" "}
            </span>
            <span className="bg-amber-600 py-2 px-3 text-sm lg:text-base rounded-lg text-white">
              Urgent
            </span>
          </p>
          <p>
            <span className="lg:hidden font-semibold text-sm text-black">
              Status:{" "}
            </span>
            <span className="bg-red-600 py-2 px-3 text-sm lg:text-base rounded-lg text-white">
              Pending
            </span>
          </p>
          <p className="flex justify-between items-center">
            <span>
              <span className="lg:hidden font-semibold text-sm text-black">
                Accepted On:{" "}
              </span>
              23 June 2025
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
