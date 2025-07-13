"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { RootState } from "@/store/store";
import Image from "next/image";
import React, { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const user = useAuth();
  const auth = useSelector((state: RootState) => state.auth);
  useEffect(() => {
    console.log("✅ Auth on reload:", auth);
  }, [auth]);

  console.log(user);

  return (
    <div className="flex h-screen">
      <div className="relative flex-1/2 hidden lg:block">
        <div className='bg-[url("/auth-cover.jpg")] bg-cover bg-center w-full h-full absolute inset-0 saturate-0 z-0 rounded-r-2xl' />
        <div className="absolute inset-0 bg-[#8300EA]/80 mix-blend-multiply rounded-r-2xl z-10" />

        <div className="relative z-20 text-white">
          <Image
            src="/sahit-logo.png"
            width={170}
            height={50}
            alt="logo"
            className="invert pt-8 ml-8 w-auto h-auto"
          />
          <div className="flex flex-col h-screen justify-center -mt-24 gap-2 items-center">
            <h1 className="text-2xl">Welcome To</h1>
            <p className="text-4xl font-semibold">SAHIT Support Portal</p>
            <p className="text-xl italic">
              A relentless pursuit to bring more women into the workforce
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#F7F8FA] flex-1/2 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
