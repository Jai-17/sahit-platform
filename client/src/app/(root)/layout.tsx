"use client"

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import StoreProvider from "@/store/StoreProvider";
import React, { ReactNode } from "react";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <StoreProvider>
      <div className="flex h-screen bg-[#F7F8FA]">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
            <Header />
            <main className="flex-1 overflow-y-auto">{children}</main>
        </div> 
      </div>
    </StoreProvider>
  );
};

export default MainLayout;
