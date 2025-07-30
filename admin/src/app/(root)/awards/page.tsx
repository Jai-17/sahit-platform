"use client";
import React, { useState } from "react";
import { columns as baseColumns } from "./columns";
import { DataTable } from "./data-table";
import { AwardDetails } from "./awardDetails";
import { useGetAllAwardsQuery } from "@/store/features/apiSlice";

// export const payments: Awards[] = [
//   {
//     id: "728ed52f",
//     username: "Jai Madhukar",
//     role: "HELP_SEEKER",
//     updatedAt: "21 June",
//     status: "PENDING",
//   },
//   {
//     id: "728ed52fss",
//     username: "Ramesh",
//     role: "HELP_SEEKER",
//     updatedAt: "21 June",
//     status: "PENDING",
//   },
//   {
//     id: "728sded52fss",
//     username: "Kalam Foundation",
//     role: "NGO",
//     updatedAt: "21 June",
//     status: "PENDING",
//   },
// ];

const Page = () => {
  const {data, isLoading} = useGetAllAwardsQuery(undefined);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);

  const columns = baseColumns({ onSelect: (id) => setSelectedRow(id) });

  if(isLoading) return <div>Loading...</div>
  console.log(data?.data);

  return (
    <div>
      <div>
        <h1 className="text-2xl lg:text-3xl font-semibold mb-2">
          Sahit Awards 🏆
        </h1>
        <p className="text-neutral-500 text-sm lg:text-base">
          All Support Seekers who have registed on the platform
        </p>
      </div>
      <div className="container mx-auto py-2">
        <DataTable columns={columns} data={data?.data} />
      </div>

      <AwardDetails
        open={!!selectedRow}
        awardId={selectedRow}
        onClose={() => setSelectedRow(null)}
      />
    </div>
  );
};

export default Page;
