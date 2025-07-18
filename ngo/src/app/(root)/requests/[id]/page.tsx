"use client";

import InfoTab from "@/components/common/InfoTab";
import StatusTab from "@/components/common/StatusTab";
import { useGetIncomingRequestByIdQuery } from "@/store/features/apiSlice";
import { useParams } from "next/navigation";
import React from "react";
import { format } from "date-fns";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import InfoCard from "@/components/common/InfoCard";
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
import { toast } from "sonner";
import { useAcceptIncomingRequestMutation } from "@/store/features/protectedApiSlice";

const Page = () => {
  const params = useParams();
  const id = params.id;
  const { data, isLoading, refetch } = useGetIncomingRequestByIdQuery(id);
  const [acceptIncomingRequest] = useAcceptIncomingRequestMutation();

  if (isLoading) return <div>Loading...</div>;
  console.log(data);

  async function onSubmit() {
    console.log("Request ACCEPTED");
    try {

      await acceptIncomingRequest({
        requestId: id
      }).unwrap()
      toast.success("Request Accepted and Sent to User");
      refetch();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error('Error Accepting Request', error);
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold mb-2">
            Incoming Requests
          </h1>
        </div>
        {(data?.data.status != "IN_PROGRESS" ||
          data?.data.status != "RESOLVED") && (
          <div className="flex gap-2 mt-5 md:mt-0">
            <AlertDialog>
              <AlertDialogTrigger className="border outline-none border-red-500 text-red-500 bg-transparent hover:bg-red-50 h-10 px-7 rounded-md transition duration-200 ease-in cursor-pointer">
                Decline
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Decline Request?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. Are you sure to approve the
                    User?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-500 hover:bg-red-300"
                    onClick={onSubmit}
                  >
                    Decline
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <AlertDialog>
              <AlertDialogTrigger className="bg-[#8300EA] h-10 px-7 text-white rounded-md hover:bg-[#8300EA90] transition duration-200 ease-in cursor-pointer">
                Accept
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Accept Request</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. Are you sure to approve the
                    User?
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
            </AlertDialog>
          </div>
        )}
      </div>
      <div className="mt-4 flex flex-col md:flex-row gap-3">
        <p className="text-2xl font-semibold text-[#8300EA]">{`INC-${id?.slice(
          0,
          8
        )}`}</p>
        <div className="flex gap-2 md:flex-row">
          <StatusTab
            title={data.data.urgency}
            color={
              data.data.urgency == "HIGH" || data.data.urgency == "URGENT"
                ? "RED"
                : data.data.urgency == "MEDIUM"
                ? "ORANGE"
                : "YELLOW"
            }
          />
          <StatusTab title={data.data.helpType} color="YELLOW" />
          <StatusTab
            title={
              data.data.status == "SEND_TO_NGOS"
                ? "Not Accepted"
                : "Accepted"
            }
            color="PRIMARY"
          />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-2 mt-7">
        <InfoTab title="Alias" value={data.data.user.alias} />
        <InfoTab title="City" value={data.data.user.city} />
        <InfoTab title="State" value={data.data.user.state} />
        <InfoTab
          title="Submitted At"
          value={format(new Date(data.data.submittedAt), "PPP")}
        />
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
      <div className="mt-5 flex flex-col gap-5">
        <InfoCard heading={data.data.title}>{data.data.description}</InfoCard>
        <InfoCard heading="Attachments">
          {data.data.attachments.length == 0
            ? "No attachments found"
            : data.data.attachments}
        </InfoCard>
      </div>
      <p className="mt-10 text-neutral-500">
        Note: This user is verified on our platform. For privacy reasons,
        personal information is hidden until the request is accepted. Identity
        documents will be accessible after confirmation.
      </p>
    </div>
  );
};

export default Page;
