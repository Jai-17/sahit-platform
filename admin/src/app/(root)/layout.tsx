"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { RootState } from "@/store/store";
import { redirect } from "next/navigation";
import React, { ReactNode} from "react";
import { useSelector } from "react-redux";

const MainLayout = ({ children }: { children: ReactNode }) => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn)
  if(!isLoggedIn) {
    redirect('/sign-in');
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
