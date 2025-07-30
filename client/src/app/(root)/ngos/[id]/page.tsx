"use client";

import Image from "next/image";
import {
  useGetNGOByIdQuery,
} from "@/store/features/apiSlice";
import { useParams } from "next/navigation";
import React from "react";
import IconName from "@/components/common/IconName";
import StatusTab from "@/components/common/StatusTab";
import InfoTab from "@/components/common/InfoTab";
import { format } from "date-fns";
import { Mail, Phone } from "lucide-react";
import InfoCard from "@/components/common/InfoCard";

const Page = () => {
  const params = useParams();
  const id = params.id;
  console.log(id);

  const { data, isLoading } = useGetNGOByIdQuery(id);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold mb-2">
            NGO Details
          </h1>
          <p className="text-neutral-500 text-sm lg:text-base">
            Registered NGO details
          </p>
        </div>
      </div>
      <div className="mt-7">
        <div className="flex flex-col md:flex-row gap-5 md:items-center">
          <IconName name={data.data.name} />
          <div className="flex gap-2">
            <StatusTab
              title={data.data.helpStatus ? data.data.helpStatus : "Inactive"}
              color={data.data.helpStatus ? "ORANGE" : "GRAY"}
            />
            <StatusTab
              title={`Typically replies in ${data.data.replyTimeMins} mins`}
              color="GRAY"
            />
          </div>
          <div className="flex flex-row gap-2">
            {data.data.supportTypes.length > 0 &&
              data.data.supportTypes.map((data: string) => (
                <StatusTab key={data} title={data} color="PRIMARY" />
              ))}
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-2 mt-7">
          <InfoTab title="Address" value={data.data.address} />
          <InfoTab title="City" value={data.data.city} />
          <InfoTab title="State" value={data.data.state} />
          <InfoTab title="Rating" value={`⭐ ${data.data.rating}`} />
          <InfoTab
            title="Registered On"
            value={format(new Date(data.data.createdAt), "PPP")}
          />
          <InfoTab title="Contact">
            <div className="ml-2 flex items-center gap-7">
              {/* Email Icon */}
              {data.data.email && (
                <a
                  href={`mailto:${data.data.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Mail className="cursor-pointer" />
                </a>
              )}

              {/* Phone Icon */}
              {data.data.phone && (
                <a
                  href={`tel:${data.data.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Phone className="cursor-pointer" />
                </a>
              )}

              {/* WhatsApp Icon */}
              {data.data.whatsappNumber && (
                <a
                  href={`https://wa.me/${data.data.whatsappNumber.replace(
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
            <InfoTab title="Name" value={data.data.representativeName} />
            <InfoTab title="Title" value={data.data.representativeTitle} />
            <InfoTab
              title="Availability"
              value={data.data.representativeAvailability}
            />
          </div>
        </div>
        <div className="mt-5">
          <InfoCard heading="About the NGO">{data.data.about}</InfoCard>
        </div>
      </div>
    </div>
  );
};

export default Page;
