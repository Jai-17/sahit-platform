import OnboardingProgress from "@/components/common/OnboardingProgress";
import { auth } from "@/config/auth";
import { OnboardingFormProvider } from "@/store/OnboardingFormContext";
import { redirect } from "next/navigation";
import Image from "next/image";
import React, { ReactNode } from "react";

const OnboardingLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  
  if(!session) {
    console.log(session);
    redirect('/sign-in');
  }

  return (
    <div className="flex h-screen bg-[#F7F8FA]">
      <div className="bg-[#EEEEEE] border border-neutral-300 m-3 rounded-lg w-[400px] p-9 hidden lg:block">
        <div>
          <Image src="/sahit-logo.png" width={170} height={50} alt="logo" />
          <div className="mt-12">
            <OnboardingProgress />
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <OnboardingFormProvider>{children}</OnboardingFormProvider>
      </div>
    </div>
  );
};

export default OnboardingLayout;
