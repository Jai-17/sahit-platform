import StatsCard from "@/components/common/StatsCard";
import SentRequestStatus from "@/components/support-db/SentRequestStatus";
import { Button } from "@/components/ui/button";
import { BellIcon } from "lucide-react";
import React from "react";

const totalReq = {
  title: "Total Requests",
  statNumber: 24,
  progress: true,
  progressNumber: 3,
  icon: <BellIcon size={40} />,
};

const HomePage = () => {
  return (
    <>
      {/* Top Cards Stats */}
      <div className="flex flex-col lg:flex-row gap-5">
        <div className="flex-1 shadow-lg/5">
          <div className="h-full relative rounded-lg overflow-hidden">
            <div className="relative h-full bg-[url('/support-bg.png')] bg-cover bg-center text-white p-6 rounded-lg">
              <p>Here to Connect you with Help!</p>
              <h2 className="text-xl lg:text-2xl font-semibold mt-2">
                Hey, you have 1 new notification and 2 new requests.
              </h2>
              <Button className="bg-white text-black px-10 py-5 mt-5 cursor-pointer hover:bg-neutral-200 transition-colors ease-in-out duration-300">
                New Request
              </Button>
            </div>
          </div>
        </div>

        <div className="h-full">
          <StatsCard {...totalReq} />
        </div>
      </div>

      {/* Notifications Panel */}
      <div className="bg-white shadow-lg/5 p-7 rounded-lg mt-7 flex flex-col gap-5">
        <h1 className="text-xl lg:text-3xl font-semibold">Latest Notifications 🔔</h1>
        <p className="text-neutral-700">
          1 New Chat Request from Kalam NGO. Check out now!
        </p>
      </div>

      {/* Request Status */}
      <h1 className="text-2xl lg:text-3xl font-semibold mb-2 mt-10">Request Status</h1>
      <p className="text-neutral-500 text-sm lg:text-base">
        Check out your incoming requests and choose them from here
      </p>

      <div className="bg-white mt-5 p-5 rounded-lg">
        <h1 className="text-2xl font-semibold">Active Requests</h1>
        <div className="px-6">
          <SentRequestStatus />
        </div>      
      </div>
    </>
  );
};

export default HomePage;
