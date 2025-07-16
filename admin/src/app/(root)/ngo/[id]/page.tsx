"use client";

// import {
//   useGetHelpSeekerByIdQuery,
//   useHelpSeekerAdminApproveMutation,
// } from "@/store/features/apiSlice";
import { useParams } from "next/navigation";
import React from "react";
// import { toast } from "sonner";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";

const Page = () => {
  const params = useParams();
  const id = params.id;
  console.log(id);

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold mb-2">
            User Details
          </h1>
          <p className="text-neutral-500 text-sm lg:text-base">
            Registered Help Seeker user details
          </p>
        </div>
        {/* {!data?.data.user.isAdminApproved && (
          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger className="bg-[#8300EA] h-10 px-7 text-white rounded-md hover:bg-[#8300EA90] transition duration-200 ease-in cursor-pointer">Open</AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Approve User?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. Are you sure to approve the User?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-[#8300EA] hover:bg-[#8300EA90]" onClick={onSubmit}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Page;
