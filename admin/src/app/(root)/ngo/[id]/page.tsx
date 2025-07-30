"use client";

import Image from "next/image";
import {
  useGetNGOByIdQuery,
  useGetNGOFeedbacksQuery,
  useNgoAdminApproveMutation,
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
import InfoCard from "@/components/InfoPage/InfoCard";

interface FeedbackData {
  id: string;
  rating: number;
  content: string;
  createdAt: string;
}

const Page = () => {
  const params = useParams();
  const id = params.id;
  console.log(id);

  const { data, isLoading, refetch } = useGetNGOByIdQuery(id);
  const [ngoAdminApprove] = useNgoAdminApproveMutation();
  const { data: feedbacks, isLoading: isLoadingFeedback } =
    useGetNGOFeedbacksQuery(id);
  console.log(data);

  if (isLoading) return <div>Loading...</div>;

  async function onSubmit() {
    try {
      await ngoAdminApprove({
        userId: data.data.userId,
      }).unwrap();

      toast.success("NGO Approved Successfully!");
      refetch();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error("Error Approving User", error);
    }
  }

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
        {!data?.data.user.isAdminApproved && (
          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger className="bg-[#8300EA] h-10 px-7 text-white rounded-md hover:bg-[#8300EA90] transition duration-200 ease-in cursor-pointer">
                Open
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
                    Approve
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
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
        <div className="mt-5">
          <InfoCard heading="ID Proofs">
            <div className="flex flex-col gap-5">
              {data.data.verifiedDocs.length > 0 ? (
                data.data.verifiedDocs.map((url: string) => {
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
                <p>No ID Proofs Uploaded</p>
              )}
            </div>
          </InfoCard>
        </div>
        <div className="mt-5">
          <InfoCard heading="Feedbacks">
            {!isLoadingFeedback ? (
              feedbacks.data.length > 0 ? (
                feedbacks.data.map((feedback: FeedbackData) => (
                  <div
                    key={feedback.id}
                    className="bg-[#F7F8FA] p-5 rounded-lg border border-neutral-200 mt-5"
                  >
                    <div className="flex gap-2">
                      <StatusTab
                        title={`⭐ ${feedback.rating}`}
                        color="PRIMARY"
                      />
                      <StatusTab
                        title={`On ${format(
                          new Date(feedback.createdAt),
                          "PPP"
                        )}`}
                        color="GRAY"
                      />
                    </div>
                    <p className="text-lg mt-3">{feedback.content}</p>
                  </div>
                ))
              ) : (
                <div>No feedbacks yet!</div>
              )
            ) : (
              <div>Loading Feedbacks...</div>
            )}
          </InfoCard>
        </div>
      </div>
    </div>
  );
};

export default Page;
