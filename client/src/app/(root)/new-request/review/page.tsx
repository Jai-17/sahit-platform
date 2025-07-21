/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { useRequestForm } from "@/store/RequestFormContext";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import React from "react";
import Image from "next/image";
import { useCreateHelpRequestMutation } from "@/store/features/protectedApiSlice";
import { toast } from "sonner";

const Page = () => {
  const { data } = useRequestForm();
  const [createHelpRequest, { isLoading }] =
    useCreateHelpRequestMutation();
  const router = useRouter();

  async function onSubmit(e: any) {
    e.preventDefault();

    try {
      await createHelpRequest(data).unwrap();
      toast.success("Request Sent Successfully");
      router.push("/");
    } catch (err: any) {
      console.log("RTK Error:", err);
      const message = err?.data?.message || "Something went wrong";
      toast.error(message);
    }
  }

  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <h1 className="font-semibold text-xl">Review your Request</h1>
        <p className="mt-2 text-neutral-600">
          Give your request a final review before submitting.
        </p>
        <h1 className="mt-5 font-semibold text-xl">Details</h1>
        <div className="mt-2 grid grid-cols-2 gap-5 bg-neutral-50 p-10 rounded-lg border-dashed border-neutral-300 border-2">
          <p>
            <span className="font-semibold">Request Title: </span>
            {data?.title}
          </p>
          <p>
            <span className="font-semibold">Request Description: </span>
            {data?.description}
          </p>
          <p>
            <span className="font-semibold">Request Help Type: </span>
            {data?.helpType}
          </p>
          <p>
            <span className="font-semibold">Request Urgency: </span>
            {data?.urgency}
          </p>
        </div>
        <h1 className="mt-5 font-semibold text-xl">Attachments</h1>
        <div className="mt-2 grid grid-cols-2 gap-5 bg-neutral-50 p-10 rounded-lg border-dashed border-neutral-300 border-2">
          <div className="flex flex-col gap-5">
            {data?.attachments!.length > 0 ? (
              data.attachments?.map((url: string) => {
                const isPdf = url.toLowerCase().endsWith(".pdf");

                return isPdf ? (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-neutral-300 py-2 px-4 w-fit rounded-md border outline-dashed scale-100 hover:scale-105 transition-all duration-300 ease-in text-neutral-700 hover:text-black"
                  >
                    View PDF Document
                  </a>
                ) : (
                  <Image
                    key={url}
                    src={url}
                    width={500}
                    height={400}
                    alt="ID Proof"
                    className="rounded-lg my-2"
                  />
                );
              })
            ) : (
              <p>No Attachments Uploaded</p>
            )}
          </div>
        </div>
        <h1 className="mt-5 font-semibold text-xl">Disclosures</h1>
        <div className="mt-2 grid grid-cols-3 gap-5 bg-neutral-50 p-10 rounded-lg border-dashed border-neutral-300 border-2">
          <p>
            <span className="font-semibold">Hide ID: </span>
            {data?.hideId ? "Yes" : "Nope"}
          </p>
          <p>
            <span className="font-semibold">Hide Face: </span>
            {data?.hideFace ? "Yes" : "Nope"}
          </p>
          <p>
            <span className="font-semibold">Hide Name: </span>
            {data?.hideName ? "Yes" : "Nope"}
          </p>
        </div>
      </div>
      <div className="flex my-5 justify-between px-32">
        <Button
          onClick={() => redirect("/new-request/disclosures")}
          className="bg-neutral-400 flex !px-7 py-5 hover:bg-neutral-300 cursor-pointer"
        >
          <ArrowLeft size={18} /> Previous
        </Button>
        <Button
          type="submit"
          onClick={onSubmit}
          className="bg-[#8300EA] mb-5 flex !px-10 py-5 hover:bg-[#8300EA90] cursor-pointer"
        >
          {isLoading ? "Submitting..." : `Submit`} <ArrowRight size={20} />
        </Button>
      </div>
    </div>
  );
};

export default Page;
