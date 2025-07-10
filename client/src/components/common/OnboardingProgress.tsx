"use client";

import { cn } from "@/lib/utils";
import { CheckCircle, Upload, User } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";

const progressItems = [
  {
    name: "User Details",
    description: "Details about you",
    path: "/onboarding/details",
    icon: <User size={24} />,
  },
  {
    name: "Upload ID",
    description: "Verify your ID Proofs",
    path: "/onboarding/upload",
    icon: <Upload size={24} />,
  },
  {
    name: "Pending Verification",
    description: "Admin will verify you",
    path: "/onboarding/verify",
    icon: <CheckCircle size={24} />,
  },
];

const OnboardingProgress = () => {
  const pathname = usePathname();

  return (
    <div>
      {progressItems.map((item) => {
        const isActive = pathname === item.path;

        return (
          <div key={item.name} className="flex flex-col">
            <div className="flex items-center gap-4">
              <div className={cn("p-3 border-2 rounded-lg", isActive ? 'bg-white border-neutral-300' : 'bg-neutral-100 border-neutral-300 text-neutral-400')}>
                {item.icon}
              </div>
              <div>
                <p className={cn('font-semibold', isActive ? '' : 'text-neutral-500')}>{item.name}</p>
                <p className={cn(isActive ? 'text-neutral-500' : 'text-neutral-400')}>{item.description}</p>
              </div>
            </div>
            <div
              className={cn(
                "h-14 w-0.5 ml-6 bg-neutral-300",
                item.name === "Pending Verification" ? "hidden" : ""
              )}
            ></div>
          </div>
        );
      })}
    </div>
  );
};

export default OnboardingProgress;
