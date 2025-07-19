// Enum values (for typing & mapping)
export enum HelpStatus {
  PENDING = 'PENDING',
  SEND_TO_NGOS = 'SEND_TO_NGOS',
  ACCEPTED_BY_NGO = 'ACCEPTED_BY_NGO',
  DECLINED_BY_ALL = 'DECLINED_BY_ALL',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  DECLINED_BY_NGO = 'DECLINED_BY_NGO',
  CANCELLED_BY_USER = 'CANCELLED_BY_USER'
}

// Background color options
export const colorBG = {
  RED: "bg-[#EA0000]",
  ORANGE: "bg-[#F4914A]",
  GREEN: "bg-[#16A303]",
  PRIMARY: "bg-[#8300EA]",
  WHITE: "bg-[#F3F3F3]",
  YELLOW: "bg-[#F1D011]",
  GRAY: "bg-[#ECECEC]",
} as const;

export type ColorKey = keyof typeof colorBG;

// Mapping status string → color
export const statusColorMap: Record<HelpStatus, ColorKey> = {
  PENDING: "YELLOW",
  SEND_TO_NGOS: "PRIMARY",
  ACCEPTED_BY_NGO: "GREEN",
  DECLINED_BY_ALL: "RED",
  IN_PROGRESS: "ORANGE",
  RESOLVED: "GREEN",
  DECLINED_BY_NGO: "RED",
  CANCELLED_BY_USER: "GRAY",
};

export const statusLabelMap: Record<HelpStatus, string> = {
  PENDING: "Pending",
  SEND_TO_NGOS: "Sent to NGOs",
  ACCEPTED_BY_NGO: "Accepted",
  DECLINED_BY_ALL: "Declined by All",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  DECLINED_BY_NGO: "Declined by NGO",
  CANCELLED_BY_USER: "Cancelled",
};