"use client";

import React from "react";
import { useGetAllNGOsQuery } from "@/store/features/apiSlice";
import NGOTableCard from "./NGOTableCard";
import TableLoader from "./loaders/TableLoader";

const NGOTable = ({ searchTerm }: { searchTerm: string }) => {
  const { data, isLoading } = useGetAllNGOsQuery(undefined);

  if (isLoading) {
    return <TableLoader />
  }

  console.log(data?.data[0]);

  const filteredNGOs = data?.data?.filter((ngo: NGO) => {
    const term = searchTerm.toLowerCase();
    return (
      ngo.name.toLowerCase().includes(term) ||
      ngo.city.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      <div className="hidden lg:grid grid-cols-6 mt-10 text-neutral-600 w-full text-sm px-5 lg:px-7 border-b pb-6 mb-2">
        <p>ID</p>
        <p>Name</p>
        <p>Location</p>
        <p>Rating</p>
        <p>Total Helped</p>
        <p>Joined On</p>
      </div>

      {!filteredNGOs.length ? (
        <div className="text-center mt-10 text-xl text-neutral-400">No NGO Found</div>
      ) : (
        <div className="flex flex-col gap-2">
          {filteredNGOs.map((ngo: NGO) => {
            return <NGOTableCard key={ngo.id} ngo={ngo} />
          })}
        </div>
      )}
    </div>
  );
};

export default NGOTable;
