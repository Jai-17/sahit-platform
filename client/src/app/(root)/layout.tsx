"use client";

import Header from "@/components/common/Header";
import Sidebar from "@/components/common/Sidebar";
import { useAuth } from "@/lib/hooks/useAuth";
import { redirect } from "next/navigation";
import React, { ReactNode} from "react";

const MainLayout = ({ children }: { children: ReactNode }) => {
  const user = useAuth();
  console.log(user);
  console.log("Coming from ROOT Layout", {
    accessToken: user.accessToken,
    isVerified: user.isVerified,
    role: user.role,
    isOnboarded: user.isOnboarded,
    isAdminApproved: user.isAdminApproved,
  });

  if (!user.accessToken || !user.isVerified || user.role != "HELP_SEEKER") {
    redirect('/sign-in')
  }

  if(!user.isOnboarded) {
    redirect('/onboarding/details');
  }

  if(!user.isAdminApproved) {
    redirect('/onboarding/verify');
  }

  return (
    <div className="flex h-screen bg-[#F7F8FA]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto p-10">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
