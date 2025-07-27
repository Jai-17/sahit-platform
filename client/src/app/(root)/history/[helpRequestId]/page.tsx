"use client";

import IconName from "@/components/common/IconName";
import InfoCard from "@/components/common/InfoCard";
import InfoTab from "@/components/common/InfoTab";
import StatusTab from "@/components/common/StatusTab";
import GiveFeedback from "@/components/support-db/GiveFeedback";
import { useGetHelpRequestByIdQuery } from "@/store/features/apiSlice";
import { format } from "date-fns";
import { Mail, Phone } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React from "react";

const Page = () => {
  const { helpRequestId } = useParams();
  const { data, isLoading } = useGetHelpRequestByIdQuery(helpRequestId);
  console.log(data);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between">
        <div className="mb-5 md:mb-0">
          <h1 className="text-2xl lg:text-3xl font-semibold mb-2">
            Help Request Details
          </h1>
          <p className="text-neutral-500 text-sm lg:text-base">
            View your past help request details. You can also give feedback to
            the NGO.
          </p>
        </div>
        <GiveFeedback ngoId={data.data.assignedNGO.id} />
      </div>
      <div className="mt-7">
        <div>
          <h1 className="text-xl lg:text-2xl font-semibold mb-5">
            Request Details
          </h1>
          <div className="flex gap-2">
            <StatusTab
              title={data.data.status}
              color={data.data.status ? "GREEN" : "GRAY"}
            />
            <StatusTab
              title={data.data.helpType}
              color="PRIMARY"
            />
            <StatusTab
              title={data.data.urgency}
              color="ORANGE"
            />
          </div>
          <div className="mt-4 mb-10">
            <InfoCard heading={data.data.title}>
            {data.data.description}
          </InfoCard>
          </div>
        </div>
        <h1 className="text-xl lg:text-2xl font-semibold mb-5">NGO Details</h1>
        <div className="flex flex-col md:flex-row gap-5 md:items-center">
          <IconName name={data.data.assignedNGO.name} />
          <div className="flex gap-2">
            <StatusTab
              title={`Typically replies in ${data.data.assignedNGO.replyTimeMins} mins`}
              color="GRAY"
            />
          </div>
          <div className="flex flex-row gap-2">
            {data.data.assignedNGO.supportTypes.length > 0 &&
              data.data.assignedNGO.supportTypes.map((data: string) => (
                <StatusTab key={data} title={data} color="PRIMARY" />
              ))}
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-2 mt-7">
          <InfoTab title="Address" value={data.data.assignedNGO.address} />
          <InfoTab title="City" value={data.data.assignedNGO.city} />
          <InfoTab title="State" value={data.data.assignedNGO.state} />
          <InfoTab
            title="Rating"
            value={`⭐ ${data.data.assignedNGO.rating}`}
          />
          <InfoTab
            title="Registered On"
            value={format(new Date(data.data.assignedNGO.createdAt), "PPP")}
          />
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
        <div className="mt-5">
          <h1 className="text-xl lg:text-2xl font-semibold mb-2">
            NGO Representative Detail
          </h1>
          <div className="flex flex-col md:flex-row gap-2 mt-2">
            <InfoTab
              title="Name"
              value={data.data.assignedNGO.representativeName}
            />
            <InfoTab
              title="Title"
              value={data.data.assignedNGO.representativeTitle}
            />
            <InfoTab
              title="Availability"
              value={data.data.assignedNGO.representativeAvailability}
            />
          </div>
        </div>
        <div className="mt-5">
          <InfoCard heading="About the NGO">
            {data.data.assignedNGO.about}
          </InfoCard>
        </div>
      </div>
    </div>
  );
};

export default Page;
