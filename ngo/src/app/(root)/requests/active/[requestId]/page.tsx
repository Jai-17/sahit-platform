"use client";

import IconName from "@/components/common/IconName";
import InfoTab from "@/components/common/InfoTab";
import StatusTab from "@/components/common/StatusTab";
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
import { useParams } from "next/navigation";
import { useGetHelpRequestByIdQuery } from "@/store/features/apiSlice";
import InfoCard from "@/components/common/InfoCard";
import ChatInterface from "@/components/common/ChatInterface";
import { useAuth } from "@/lib/hooks/useAuth";

const Page = () => {
  const { requestId } = useParams();
  const { data, isLoading } = useGetHelpRequestByIdQuery(requestId);
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
              View User Details
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="text-xl text-[#8300EA] font-semibold">
                  User Details
                </SheetTitle>
                <SheetDescription>
                  Details about the Help Seeker
                </SheetDescription>
              </SheetHeader>
              <div className="px-5">
                <span className="text-2xl mb-3 text-black font-semibold">
                  {data.data.user.name}
                </span>
                <div className="mt-3 flex flex-col gap-2">
                  <InfoTab title="City" value={data.data.user.city} />
                  <InfoTab title="State" value={data.data.user.state} />
                  <InfoTab title="Address" value={data.data.user.address} />
                  <InfoTab title="Age" value={`${data.data.user.age}`} />
                  <InfoTab
                    title="Registered On"
                    value={format(new Date(data.data.user.createdAt), "PPP")}
                  />
                  <InfoTab
                    title="Occupation"
                    value={`${data.data.user.occupation}`}
                  />
                  <InfoTab
                    title="Job Type"
                    value={`${data.data.user.jobType}`}
                  />
                  <InfoTab
                    title="Company"
                    value={`${data.data.user.company}`}
                  />
                </div>
                <div className="flex flex-row gap-2 mt-4">
                  {data.data.hideId ? (
                    ""
                  ) : (
                    <InfoCard heading="ID Proof">
                      <Image
                        src={data.data.user.idProofs}
                        alt="Image"
                        height={200}
                        width={200}
                      />
                    </InfoCard>
                  )}
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

      <div className="flex flex-col md:flex-row mt-7 gap-5 md:items-center">
        <IconName
          name={
            data.data.hideName ? data.data.user.alias : data?.data.user.name
          }
          image={data.data.user.photo}
        />
        <div className="flex gap-2">
          <StatusTab title={data.data.status} />
          <StatusTab title={data.data.urgency} color="RED" />
          <div className="md:flex gap-2 hidden">
            <InfoTab title="Category" value={data.data.helpType} />
            <InfoTab title="Contact">
              <div className="ml-2 flex items-center gap-7">
                {/* Email Icon */}
                {data.data.user.email && (
                  <a
                    href={`mailto:${data.data.user.email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Mail className="cursor-pointer" />
                  </a>
                )}

                {/* Phone Icon */}
                {data.data.user.contact && (
                  <a
                    href={`tel:${data.data.user.contact}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Phone className="cursor-pointer" />
                  </a>
                )}

                {/* WhatsApp Icon */}
                {data.data.user.whatsapp && (
                  <a
                    href={`https://wa.me/${data.data.user.whatsapp.replace(
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
            {data.data.user.email && (
              <a
                href={`mailto:${data.data.user.email}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Mail className="cursor-pointer" />
              </a>
            )}

            {/* Phone Icon */}
            {data.data.user.contact && (
              <a
                href={`tel:${data.data.user.contact}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Phone className="cursor-pointer" />
              </a>
            )}

            {/* WhatsApp Icon */}
            {data.data.user.whatsapp && (
              <a
                href={`https://wa.me/${data.data.user.whatsapp.replace(
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
      <div className="p-4 space-y-4 bg-white mt-10 rounded-md shadow-lg lg:hidden">
          <div className="border rounded-lg p-4">
            <p className="font-semibold">
              {data.data.user.name}
              <span className="text-green-500 ml-1">●</span>
            </p>
          </div>

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
              <p className="font-semibold">
                {data.data.user.name}
                <span className="text-green-500 ml-1">●</span>
              </p>
            </div>

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
          <ResizablePanel defaultSize={55} minSize={40}>
            <ChatInterface
              sender={auth.userId!}
              reciever={data?.data.user.userId}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
        <div className="h-[40px] lg:hidden"></div>
      </div>
    </div>
  );
};

export default Page;
