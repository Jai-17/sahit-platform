import React from "react";
import SentRequestTableCard from "./SentRequestTableCard";

const SentRequestStatus = () => {
  return (
    <div>
      <div className="hidden lg:grid grid-cols-6 mt-10 text-neutral-600 w-full text-sm px-5 lg:px-7 border-b pb-6 mb-2">
        <p>ID</p>
        <p>NGO Name</p>
        <p>Help Type</p>
        <p>Urgency</p>
        <p>Status</p>
        <p>Accepted On</p>
      </div>

      <div className="flex flex-col gap-2">
        <SentRequestTableCard />
      </div>
    </div>
  );
};

export default SentRequestStatus;
