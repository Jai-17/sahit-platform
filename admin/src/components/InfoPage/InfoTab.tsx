import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

const InfoTab = ({
  title,
  value,
  children,
}: {
  title: string;
  value?: string;
  children?: ReactNode;
}) => {
  return (
    <div className="flex items-center">
      <div className={cn("bg-white border-2 w-fit border-neutral-100 p-3 rounded-md flex items-center", value ? "" : "mr-2")}>
        <p className={cn("font-medium text-[#8300EA]", value ? "mr-2" : "")}>{title}:</p>
        {!!value && value}
      </div>
      {children}
    </div>
  );
};

export default InfoTab;
