"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/useAuth";
import { useGetHelpSeekerByIdQuery } from "@/store/features/apiSlice";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

const Page = () => {
    const {roleId} = useAuth();
    const {data, isLoading} = useGetHelpSeekerByIdQuery(roleId);
    if(isLoading) return <div>Loading...</div>
    console.log(data);
  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <h1 className="font-semibold text-xl">General Information</h1>
        <p className="mt-2 text-neutral-600">
          Check and verify your profile information, you can edit it from the
          profile page
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 bg-neutral-50 p-5 rounded-md mt-5">
            <p><span className="font-semibold">Name: </span>{data?.data?.name}</p>
            <p><span className="font-semibold">Occupation: </span>{data?.data?.occupation}</p>
            <p><span className="font-semibold">Address: </span>{data?.data?.address}</p>
            <p><span className="font-semibold">City: </span>{data?.data?.city}</p>
            <p><span className="font-semibold">State: </span>{data?.data?.state}</p>
            <p><span className="font-semibold">Company: </span>{data?.data?.company}</p>
            <p><span className="font-semibold">Job Type: </span>{data?.data?.jobType}</p>
            <p><span className="font-semibold">Age: </span>{data?.data?.age}</p>
            <p><span className="font-semibold">Contact: </span>{data?.data?.contact}</p>
            <p><span className="font-semibold">Whatsapp Number: </span>{data?.data?.whatsapp}</p>
            <p><span className="font-semibold">Alias: </span>{data?.data?.alias}</p>
        </div>
        <div>
            <h1 className="text-lg font-semibold mt-5">ID Proof</h1>
            <Image src={data?.data?.idProofs} alt="id proof" width={300} height={300} className="border-2 rounded-lg border-neutral-400" />
        </div>
      </div>
      <div className="flex my-5 justify-between lg:px-32">
        <Button
          onClick={() => redirect("/new-request")}
          className="bg-neutral-400 flex !px-7 py-5 hover:bg-neutral-300 cursor-pointer"
        >
          <ArrowLeft size={18} /> Previous
        </Button>
        <Button
          onClick={() => redirect("/new-request/details")}
          className="bg-[#8300EA] flex !px-10 py-5 hover:bg-[#8300EA90] cursor-pointer"
        >
          Next <ArrowRight size={20} />
        </Button>
      </div>
    </div>
  );
};

export default Page;
