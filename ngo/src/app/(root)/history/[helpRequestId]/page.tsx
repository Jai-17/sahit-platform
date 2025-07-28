"use client";

import IconName from "@/components/common/IconName";
import InfoCard from "@/components/common/InfoCard";
import InfoTab from "@/components/common/InfoTab";
import StatusTab from "@/components/common/StatusTab";
import { useGetHelpRequestByIdQuery } from "@/store/features/apiSlice";
import { format } from "date-fns";
import { Mail, Phone } from "lucide-react";
import { useParams } from "next/navigation";
import Image from "next/image";
import React from "react";

const Page = () => {
  const { helpRequestId } = useParams();
  const { data, isLoading } = useGetHelpRequestByIdQuery(helpRequestId);
  console.log(data);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold mb-2">
            Help Request Details
          </h1>
          <p className="text-neutral-500 text-sm lg:text-base">
            View your past help request details. You can also give feedback to
            the NGO.
          </p>
        </div>
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
            <StatusTab title={data.data.helpType} color="PRIMARY" />
            <StatusTab title={data.data.urgency} color="ORANGE" />
          </div>
          <div className="mt-4 mb-10">
            <InfoCard heading={data.data.title}>
              {data.data.description}
            </InfoCard>
          </div>
        </div>
        <h1 className="text-xl lg:text-2xl font-semibold mb-5">User Details</h1>
        <div className="flex flex-col md:flex-row gap-5 md:items-center">
          <IconName name={data.data.hideName ? data.data.user.alias : data.data.user.name} image={data.data.hideFace ? "" : data.data.user.photo} />
        </div>
        <div className="flex flex-col lg:flex-row gap-2 mt-7">
            <InfoTab title="Address" value={data.data.user.address} />
            <InfoTab title="City" value={data.data.user.city} />
            <InfoTab title="State" value={data.data.user.state} />
            <InfoTab title="Age" value={`${data.data.user.age}`} />
            <InfoTab
              title="Registered On"
              value={format(new Date(data.data.user.createdAt), "PPP")}
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
          <div className="flex flex-col lg:flex-row gap-2 mt-7">
            <InfoTab title="Company" value={data.data.user.company} />
            <InfoTab title="Occupation" value={data.data.user.occupation} />
            <InfoTab title="Job Type" value={data.data.user.jobType} />
          </div>
      </div>
    </div>
  );
};

export default Page;
