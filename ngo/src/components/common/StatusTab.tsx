import { colorBG, ColorKey, HelpStatus, statusColorMap, statusLabelMap } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface StatusProps {
  title: string;           // e.g. "PENDING"
  icon?: ReactNode;
  color?: ColorKey;
}
const StatusTab = ({ title, icon, color }: StatusProps) => {
  // Use provided color, otherwise check if title matches a known status
  const resolvedColor: ColorKey = color ?? statusColorMap[title as HelpStatus] ?? "GRAY";
  const prettyTitle: string = statusLabelMap[title as HelpStatus] ?? title;

  return (
    <div
      className={cn(
        colorBG[resolvedColor],
        'py-1 px-4 rounded-lg flex items-center w-fit text-xs md:text-base',
        (resolvedColor === 'GRAY' || resolvedColor === 'WHITE') ? 'text-neutral-600' : 'text-white'
      )}
    >
      {icon && <div className="mr-2">{icon}</div>}
      {prettyTitle}
    </div>
  );
};


export default StatusTab;