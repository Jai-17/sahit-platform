import RequestFormStatusHeader from "@/components/forms/RequestFormStatusHeader";
import { RequestFormProvider } from "@/store/RequestFormContext";
import React, { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <h1 className="text-2xl lg:text-3xl font-semibold mb-2">
        New Request
      </h1>
      <p className="text-neutral-500 text-sm lg:text-base">
        Submit your help request and we will make sure it reaches the right people!
      </p>
      <div className="flex justify-center mt-10">
        <RequestFormStatusHeader />
      </div>
      <div className="bg-white shadow-lg/5 p-10 mt-7 rounded-lg overflow-y-auto h-[580px]">
        <RequestFormProvider>{children}</RequestFormProvider>
      </div>
    </div>
  );
};

export default Layout;
