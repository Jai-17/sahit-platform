"use client";

import IconName from "@/components/common/IconName";
import InfoTab from "@/components/common/InfoTab";
import StatusTab from "@/components/common/StatusTab";
import { useGetActiveHelpRequestDetailsQuery } from "@/store/features/protectedApiSlice";
import { Mail, Phone } from "lucide-react";
import React from "react";
import Image from "next/image";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
// import ChatInterface from "@/components/common/ChatInterface";
import TestChat from "@/components/common/TestChat";
import { useAuth } from "@/lib/hooks/useAuth";

const Page = () => {
  const { data, isLoading } = useGetActiveHelpRequestDetailsQuery(undefined);
  const auth = useAuth();
  if (isLoading) return <div>Loading...</div>;

  console.log(data?.data);
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold mb-2">
            Current Active Request
          </h1>
          <p className="text-neutral-500 text-sm lg:text-base">
            Chat and view the details of your current active request
          </p>
        </div>
        {/* MODALS PAGES */}
        <div className="flex gap-5 mt-5 md:mt-0">
          <Sheet>
            <SheetTrigger className="h-10 px-7 text-xs md:text-base border border-neutral-400 text-neutral-600 rounded-md transition duration-200 ease-in cursor-pointer">
              View NGO
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="text-xl text-[#8300EA] font-semibold">
                  NGO Details
                </SheetTitle>
                <SheetDescription>Details about the NGO</SheetDescription>
              </SheetHeader>
              <div className="px-5">
                <span className="text-2xl mb-3 text-black font-semibold">
                  About
                </span>
                <p>{data.data.assignedNGO.about}</p>
                <div className="mt-3 flex flex-col gap-2">
                  <InfoTab title="City" value={data.data.assignedNGO.city} />
                  <InfoTab title="State" value={data.data.assignedNGO.state} />
                  <InfoTab
                    title="Address"
                    value={data.data.assignedNGO.address}
                  />
                  <InfoTab
                    title="Rating"
                    value={`⭐${data.data.assignedNGO.rating}`}
                  />
                  <InfoTab
                    title="Registered On"
                    value={format(
                      new Date(data.data.assignedNGO.createdAt),
                      "PPP"
                    )}
                  />
                </div>
                <div className="flex flex-row gap-2">
                  <div className="mt-5 flex flex-col gap-5">
                    {data.data.assignedNGO.supportTypes.length > 0 &&
                      data.data.assignedNGO.supportTypes.map((data: string) => (
                        <StatusTab key={data} title={data} color="PRIMARY" />
                      ))}
                  </div>
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="outline">Close</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          <Sheet>
            <SheetTrigger className="h-10 px-7 text-xs md:text-base border border-neutral-400 text-neutral-600 rounded-md transition duration-200 ease-in cursor-pointer">
              View Request
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="text-xl text-[#8300EA] font-semibold">
                  Help Request Details
                </SheetTitle>
                <SheetDescription>
                  Details about your Help Request
                </SheetDescription>
              </SheetHeader>
              <div className="px-4">
                <h1 className="font-semibold text-2xl">{data.data.title}</h1>
                <p className="mt-4 text-neutral-600">{data.data.description}</p>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="outline">Close</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row mt-7 gap-5 lg:items-center">
        <IconName name={data?.data.assignedNGO.name} />
        <div className="flex flex-col lg:flex-row gap-2">
          <StatusTab title={data.data.status} />
          <StatusTab title={data.data.urgency} color="RED" />
          <StatusTab
            title={`Typically replies in ${data.data.assignedNGO.replyTimeMins} mins`}
            color="GRAY"
          />
          <div className="md:flex gap-2 hidden">
            <InfoTab title="Category" value={data.data.helpType} />
            <InfoTab title="Contact">
              <div className="ml-2 flex items-center gap-7">
                {/* Email Icon */}
                {data.data.assignedNGO.email && (
                  <a
                    href={`mailto:${data.data.assignedNGO.email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Mail className="cursor-pointer" />
                  </a>
                )}

                {/* Phone Icon */}
                {data.data.assignedNGO.phone && (
                  <a
                    href={`tel:${data.data.assignedNGO.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Phone className="cursor-pointer" />
                  </a>
                )}

                {/* WhatsApp Icon */}
                {data.data.assignedNGO.whatsappNumber && (
                  <a
                    href={`https://wa.me/${data.data.assignedNGO.whatsappNumber.replace(
                      /\D/g,
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src="/whatsapp.ico"
                      height={32}
                      width={32}
                      alt="whatsapp"
                      className="cursor-pointer"
                    />
                  </a>
                )}
              </div>
            </InfoTab>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2 md:hidden">
        <InfoTab title="Category" value={data.data.helpType} />
        <InfoTab title="Contact">
          <div className="ml-2 flex items-center gap-7">
            {/* Email Icon */}
            {data.data.assignedNGO.email && (
              <a
                href={`mailto:${data.data.assignedNGO.email}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Mail className="cursor-pointer" />
              </a>
            )}

            {/* Phone Icon */}
            {data.data.assignedNGO.phone && (
              <a
                href={`tel:${data.data.assignedNGO.phone}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Phone className="cursor-pointer" />
              </a>
            )}

            {/* WhatsApp Icon */}
            {data.data.assignedNGO.whatsappNumber && (
              <a
                href={`https://wa.me/${data.data.assignedNGO.whatsappNumber.replace(
                  /\D/g,
                  ""
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/whatsapp.ico"
                  height={32}
                  width={32}
                  alt="whatsapp"
                  className="cursor-pointer"
                />
              </a>
            )}
          </div>
        </InfoTab>
      </div>
      <div
            className="p-4 space-y-4 bg-white mt-10 rounded-md shadow-lg lg:hidden"
          >
            <div className="border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div>
                  <p className="font-semibold">
                    {data.data.assignedNGO.representativeName}
                    <span className="text-green-500 ml-1">●</span>
                  </p>
                  <p className="text-muted-foreground">
                    {data.data.assignedNGO.representativeTitle}
                  </p>
                  <p className="text-muted-foreground">
                    Typically Available{" "}
                    {data.data.assignedNGO.representativeAvailability}
                  </p>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <p className="font-semibold mb-2">Your Request Summary</p>
              <p className="text-muted-foreground">{data.data.description}</p>
            </div>

            <div className="border rounded-lg p-4">
              <p className="font-semibold mb-2">Brief About NGO</p>
              <p className="text-muted-foreground">
                {data.data.assignedNGO.about}
              </p>
            </div>
          </div>
      <div className="mt-7 bg-white rounded-lg shadow-lg/5 h-[calc(100vh-330px)]">
        <ResizablePanelGroup direction="horizontal">
          {/* LEFT PANEL */}
          <ResizablePanel
            defaultSize={45}
            minSize={30}
            maxSize={60}
            className="p-4 space-y-4 hidden lg:inline"
          >
            <div className="border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div>
                  <p className="font-semibold">
                    {data.data.assignedNGO.representativeName}
                    <span className="text-green-500 ml-1">●</span>
                  </p>
                  <p className="text-muted-foreground">
                    {data.data.assignedNGO.representativeTitle}
                  </p>
                  <p className="text-muted-foreground">
                    Typically Available{" "}
                    {data.data.assignedNGO.representativeAvailability}
                  </p>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <p className="font-semibold mb-2">Your Request Summary</p>
              <p className="text-muted-foreground">{data.data.description}</p>
            </div>

            <div className="border rounded-lg p-4">
              <p className="font-semibold mb-2">Brief About NGO</p>
              <p className="text-muted-foreground">
                {data.data.assignedNGO.about}
              </p>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* RIGHT PANEL */}
          <ResizablePanel
            defaultSize={55}
            minSize={40}
          >
           {/* <ChatInterface /> */}
           <TestChat sender={auth.userId!} reciever={data?.data.assignedNGO.userId} />
          </ResizablePanel>
        </ResizablePanelGroup>

          <div className="h-[40px] lg:hidden"></div>
      </div>
    </div>
  );
};

export default Page;
