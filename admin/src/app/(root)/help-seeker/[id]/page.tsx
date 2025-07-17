"use client";

import {
  useGetHelpSeekerByIdQuery,
  useHelpSeekerAdminApproveMutation,
} from "@/store/features/apiSlice";
import { useParams } from "next/navigation";
import React from "react";
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
import IconName from "@/components/InfoPage/IconName";
import StatusTab from "@/components/StatusTab";
import InfoTab from "@/components/InfoPage/InfoTab";
import { format } from "date-fns";
import { Mail, Phone } from "lucide-react";
import Image from "next/image";
import InfoCard from "@/components/InfoPage/InfoCard";

const Page = () => {
  const params = useParams();
  const id = params.id;
  const { data, isLoading, refetch } = useGetHelpSeekerByIdQuery(id);
  const [helpSeekerAdminApprove] = useHelpSeekerAdminApproveMutation();

  if (isLoading) return <div>Loading...</div>;
  console.log(data);

  console.log(data.data.userId);

  async function onSubmit() {
    try {
      await helpSeekerAdminApprove({
        userId: data.data.userId,
      }).unwrap();

      toast.success("NGO Approved Successfully!");
      refetch();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error("Error Approving NGO", error);
    }
  }

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
        {!data?.data.user.isAdminApproved && (
          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger className="bg-[#8300EA] h-10 px-7 text-white rounded-md hover:bg-[#8300EA90] transition duration-200 ease-in cursor-pointer">
                Approve
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Approve User?</AlertDialogTitle>
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
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
      <div className="mt-7">
        <div className="flex flex-col md:flex-row gap-5 md:items-center">
          <IconName image={data.data.photo} name={data.data.name} />
          <div className="flex gap-2">
            <StatusTab
            title={data.data.helpStatus ? data.data.helpStatus : "Inactive"}
            color={data.data.helpStatus ? "ORANGE" : "GRAY"}
          />
          <StatusTab title={data.data.city} color="ORANGE" />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-2 mt-7">
          <InfoTab title="Alias" value={data.data.alias} />
          <InfoTab title="Address" value={data.data.address} />
          <InfoTab title="State" value={data.data.state} />
          <InfoTab title="Age" value={data.data.age} />
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
              {data.data.contact && (
                <a
                  href={`tel:${data.data.contact}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Phone className="cursor-pointer" />
                </a>
              )}

              {/* WhatsApp Icon */}
              {data.data.whatsapp && (
                <a
                  href={`https://wa.me/${data.data.whatsapp.replace(
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
            Work Details
          </h1>
          <div className="flex flex-col md:flex-row gap-2 mt-2">
              <InfoTab title="Job Type" value={data.data.jobType} />
              <InfoTab title="Company" value={data.data.company} />
              <InfoTab title="Occupation" value={data.data.occupation} />
          </div>
        </div>
        <div className="mt-5">
          <InfoCard heading="ID Proof">
            <Image src={data.data.idProofs} width={500} height={400} alt="id proof" className="rounded-lg" />
          </InfoCard>
        </div>
      </div>
    </div>
  );
};

export default Page;
