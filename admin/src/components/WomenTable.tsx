"use client";

import React from "react";
import WomenTableCard from "./WomenTableCard";
import { useGetAllHelpSeekerQuery } from "@/store/features/apiSlice";
import TableLoader from "./loaders/TableLoader";

const WomenTable = ({ searchTerm }: { searchTerm: string }) => {
  const { data, isLoading } = useGetAllHelpSeekerQuery(undefined);

  if (isLoading) {
    return <TableLoader />
  }

  console.log(data?.data[0]);

  const filteredWomen = data?.data?.filter((women: Women) => {
    const term = searchTerm.toLowerCase();
    return (
      women.name.toLowerCase().includes(term) ||
      women.city.toLowerCase().includes(term)
    );
  });

  console.log(filteredWomen);

  return (
    <div>
      <div className="hidden lg:grid grid-cols-6 mt-10 text-neutral-600 w-full text-sm px-5 lg:px-7 border-b pb-6 mb-2">
        <p>ID</p>
        <p>Name</p>
        <p>Help Status</p>
        <p>Location</p>
        <p>Total Requests</p>
        <p>Joined On</p>
      </div>

      {!filteredWomen.length ? (
        <div className="text-center mt-10 text-xl text-neutral-400">No User Found</div>
      ) : (
        <div className="flex flex-col gap-2">
          {filteredWomen.map((women: Women) => {
            return <WomenTableCard key={women.userId} women={women} />;
          })}
        </div>
      )}
    </div>
  );
};

export default WomenTable;
