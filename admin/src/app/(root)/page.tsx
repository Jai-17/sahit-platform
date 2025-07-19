"use client"

import StatsCard from "@/components/StatsCard";
import { useGetDBStatsQuery } from "@/store/features/apiSlice";
import { CheckCircle } from "lucide-react";
import React from "react";

const HomePage = () => {
  const {data} = useGetDBStatsQuery(undefined);
  console.log(data);
  return (
    <div>
      <div className="bg-[url('/support-bg.png')] bg-cover bg-center text-white p-6 rounded-lg">
        <h2 className="text-lg 2xl:text-xl font-semibold -m-1">
          Hey, check the overall stats of the NGOs and Women on the Sahit
          Platform
        </h2>
      </div>
      <div>
        <h1 className="text-2xl lg:text-3xl font-semibold mb-2 mt-5">
          NGO Stats
        </h1>
        <p className="text-neutral-500 text-sm lg:text-base">
          Check out your incoming requests and choose them from here
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-5">
          <StatsCard
            title="Active NGOs"
            statNumber={data.activeNGOsCount}
            progress={true}
            progressNumber={3}
            icon={<CheckCircle size={40} />}
          />
          <StatsCard
            title="Active Requests"
            statNumber={data.activeRequestsCount}
            progress={true}
            progressNumber={3}
            icon={<CheckCircle size={40} />}
          />
          <StatsCard
            title="Total Helped"
            statNumber={data.totalHelpedCount}
            progress={true}
            progressNumber={3}
            icon={<CheckCircle size={40} />}
          />
          <StatsCard
            title="Inactive NGOs"
            statNumber={data.inactiveNGOsCount}
            progress={true}
            progressNumber={3}
            icon={<CheckCircle size={40} />}
          />
        </div>
      </div>
      <div>
        <h1 className="text-2xl lg:text-3xl font-semibold mb-2 mt-5">
          Women Stats
        </h1>
        <p className="text-neutral-500 text-sm lg:text-base">
          Check out your incoming requests and choose them from here
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-5">
          <StatsCard
            title="Total"
            statNumber={data.totalHelpSeekersCount}
            progress={true}
            progressNumber={3}
            icon={<CheckCircle size={40} />}
          />
          <StatsCard
            title="Ongoing Requests"
            statNumber={data.ongoingRequestsCount}
            progress={true}
            progressNumber={3}
            icon={<CheckCircle size={40} />}
          />
          <StatsCard
            title="Total Requests"
            statNumber={data.totalRequestsCount}
            progress={true}
            progressNumber={3}
            icon={<CheckCircle size={40} />}
          />
          <StatsCard
            title="Pending Requests"
            statNumber={data.pendingNGORequestsCount}
            progress={true}
            progressNumber={3}
            icon={<CheckCircle size={40} />}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
