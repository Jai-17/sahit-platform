import InfoTab from "@/components/InfoPage/InfoTab";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useGetAwardDetailsByIdQuery } from "@/store/features/apiSlice";

export function AwardDetails({
  open,
  awardId,
  onClose,
}: {
  open: boolean;
  awardId: string | null;
  onClose: () => void;
}) {
  const { data, isLoading } = useGetAwardDetailsByIdQuery(awardId);
  if (!awardId) return null;
  console.log(data);
  if(isLoading) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="!w-[800px] !max-w-none p-6">
        <SheetHeader>
          <SheetTitle>View Application</SheetTitle>
          <SheetDescription>
            View the Award application submitted by the user.
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4 overflow-y-auto">
          {data?.data.user.helpSeeker && (
            <div className="grid grid-cols-2 gap-2">
              <InfoTab title="City" value={data?.data.user.helpSeeker.city} />
              <InfoTab title="State" value={data?.data.user.helpSeeker.state} />
              <InfoTab
                title="Address"
                value={data?.data.user.helpSeeker.address}
              />
              <InfoTab
                title="Occupation"
                value={data?.data.user.helpSeeker.occupation}
              />
              <InfoTab
                title="Job Type"
                value={data?.data.user.helpSeeker.jobType}
              />
              <InfoTab
                title="Company"
                value={data?.data.user.helpSeeker.company}
              />
              <InfoTab title="Age" value={data?.data.user.helpSeeker.age} />
            </div>
          )}
          {data?.data.user.ngo && (
            <div className="grid grid-cols-2 gap-2">
              <InfoTab title="City" value={data?.data.user.ngo.city} />
              <InfoTab title="State" value={data?.data.user.ngo.state} />
              <InfoTab title="Address" value={data?.data.user.ngo.address} />
              <InfoTab title="Rating" value={data?.data.user.ngo.rating} />
            </div>
          )}
          <div>
            <h1 className="text-lg font-semibold text-[#8300EA]">Work Done</h1>
            <p className="mt-2 text-base/8">{data.data.workDone}</p>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-[#8300EA]">
              Why should we nominate you?
            </h1>
            <p className="mt-2 text-base/8">{data.data.reason}</p>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
