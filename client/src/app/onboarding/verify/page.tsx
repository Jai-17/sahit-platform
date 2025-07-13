"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/useAuth";
import { setIsAdminApproved } from "@/store/features/authSlice";
import { useGetUserQuery } from "@/store/features/protectedApiSlice";
import { useOnboardingForm } from "@/store/OnboardingFormContext";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const VerifyPage = () => {
  const auth = useAuth();
  const { data } = useOnboardingForm();
  console.log(data);
  const router = useRouter();
  const dispatch = useDispatch();
  const {data: user, isLoading} = useGetUserQuery(undefined);
  console.log(user, 'COMING FROM PAGE VERIFY');

  useEffect(() => {
    if(!isLoading && user?.data?.isAdminApproved) {
    console.log('COMING FROM PAGE VERIFY ADMIN APPROVED', user?.data?.isAdminApproved);
    dispatch(setIsAdminApproved(true));
    console.log(auth)
    router.push('/');
  }
  }, [isLoading, user, dispatch, auth, router]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-4xl font-semibold">Verification</h1>
        <p>Kindly Wait for the Admin to verify your account!</p>
        <p>We will notify you once you are verified!</p>
        <Image
          src="/verification.svg"
          width={300}
          height={500}
          alt="Verification Vector"
          className="mt-10 w-[300px] h-[500px]"
          priority={true}
        />
        <div className="flex w-full justify-between mt-6 md:mt-2">
          <Button
            onClick={() => router.push("/onboarding/upload")}
            className="w-40 min-h-1 bg-neutral-300 hover:bg-neutral-400 cursor-pointer transition duration-300 ease-in"
          >
            <ArrowLeft /> Previous
          </Button>
          <Button
          disabled
            onClick={() => toast.success("Admin will verify you soon!")}
            className="w-40 min-h-10 bg-[#8300EA] hover:bg-[#8300EA95] transition duration-300 cursor-pointer ease-in"
          >
            Next
            <ArrowRight />
          </Button>
        </div>
      </div>
      <div className="flex gap-2 mt-8 w-[200px]">
        <div className="w-full h-2 bg-neutral-200 rounded-3xl"></div>
        <div className="w-full h-2 bg-neutral-200 rounded-3xl"></div>
        <div className="w-full h-2 bg-[#8300EA] rounded-3xl"></div>
      </div>
    </div>
  );
};

export default VerifyPage;
