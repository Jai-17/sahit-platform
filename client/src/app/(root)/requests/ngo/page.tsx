import { Button } from "@/components/ui/button";
import React from "react";

const Page = () => {
  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold mb-2">
            Incoming Request
          </h1>
          <p className="text-neutral-500 text-sm lg:text-base">
            Check out your incoming requests and choose them from here
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="px-7 h-10 cursor-pointer" variant='outline'>Request More Info</Button>
          <Button className="bg-[#8300EA] h-10 px-7 hover:bg-[#8300EA90] transition duration-200 ease-in cursor-pointer">Accept</Button>
          <Button className="px-7 h-10 cursor-pointer" variant='destructive'>Decline</Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
