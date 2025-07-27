"use client";

import React from "react";
import StatusTab from "../common/StatusTab";
import { Clock, MapPin } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { formatTimeAgo } from "@/lib/utils";
import { useAcceptIncomingRequestMutation } from "@/store/features/protectedApiSlice";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const IncomingRequestCard = ({ incomingRequest }: { incomingRequest: IncomingRequest  }) => {
  const router = useRouter();
  const timeAgo = formatTimeAgo(incomingRequest.helpRequest.submittedAt);
  console.log(incomingRequest);
  const [acceptIncomingRequest] = useAcceptIncomingRequestMutation();
  console.log(timeAgo);

  async function onSubmit() {
    console.log("Request ACCEPTED");
    try {
      await acceptIncomingRequest({
        requestId: incomingRequest.helpRequest.id,
      }).unwrap();
      toast.success("Request Accepted and Sent to User");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error("Error Accepting Request", error);
    }
  }

  return (
    <div className="flex flex-col bg-white drop-shadow-md rounded-xl p-7 gap-4">
      <div className="flex gap-2 justify-between">
        <div className="flex gap-2">
          <StatusTab title="Incoming" color="ORANGE" />
          <StatusTab title={incomingRequest.helpRequest?.helpType} color="YELLOW" />
        </div>
        <StatusTab icon={<Clock size={20} />} title={timeAgo} color="GRAY" />
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold truncate w-full">
          {incomingRequest.helpRequest?.title}
        </h1>
        <p className="text-neutral-500">{incomingRequest.helpRequest.description}</p>
      </div>
      <div className="flex gap-2 mt-1">
        <StatusTab
          title={incomingRequest.helpRequest?.user?.city}
          color="WHITE"
          icon={<MapPin size={20} />}
        />
        <StatusTab
          title={incomingRequest.helpRequest?.urgency}
          color={
            incomingRequest.helpRequest?.urgency == "HIGH" || incomingRequest.helpRequest?.urgency == "URGENT"
              ? "RED"
              : incomingRequest.helpRequest.urgency == "MEDIUM"
              ? "ORANGE"
              : "YELLOW"
          }
        />
      </div>
      <div className="flex gap-2 mt-1">
        {incomingRequest.status != "ACCEPTED" && <AlertDialog>
          <AlertDialogTrigger className="bg-[#8300EA] h-10 px-7 text-white rounded-md hover:bg-[#8300EA90] transition duration-200 ease-in cursor-pointer">
            Accept
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Accept Request</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. Are you sure to accept the request?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-[#8300EA] hover:bg-[#8300EA90]"
                onClick={onSubmit}
              >
                Accept
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>}
        <Button
          onClick={() => router.push(`/requests/${incomingRequest.helpRequest?.id}`)}
          variant="outline"
          className="border-[#8300EA] text-[#8300EA] h-10 hover:text-[#8300EA] cursor-pointer duration-200 ease-in transition"
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

export default IncomingRequestCard;
