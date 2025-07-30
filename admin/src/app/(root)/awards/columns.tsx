"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { useState } from "react";
import StatusTab from "@/components/StatusTab";
import { format } from "date-fns";
import { useChangeAwardStatusMutation } from "@/store/features/apiSlice";
import { toast } from "sonner";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Awards = {
  id: string;
  user: { name: string };
  role: "NGO" | "HELP_SEEKER";
  updatedAt: string;
  status:
    | "PENDING"
    | "STAGE_1_APPROVED"
    | "STAGE_2_APPROVED"
    | "NOMINATED"
    | "DECLINED";
};

function StatusActionCell({
  id,
  initialStatus,
  onViewApplication,
}: {
  id: string;
  initialStatus: Awards["status"];
  onViewApplication: (id: string) => void;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [changeAwardStatus] = useChangeAwardStatusMutation();

  async function handleSave() {
    try {
      await changeAwardStatus({ awardId: id, status }).unwrap();
      toast.success(`Changed status to ${status}`);
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(`Error changing status: ${error.data.message}`);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        value={status}
        onValueChange={(val) => setStatus(val as Awards["status"])}
      >
        <SelectTrigger className="w-[160px]">
          <span
            className={`
        ${status === "DECLINED" ? "text-red-600 bg-red-100" : ""}
        ${status === "PENDING" ? "text-yellow-600 bg-yellow-100" : ""}
        ${status === "STAGE_1_APPROVED" ? "text-blue-600 bg-blue-100" : ""}
        ${status === "STAGE_2_APPROVED" ? "text-indigo-600 bg-indigo-100" : ""}
        ${status === "NOMINATED" ? "text-green-600 bg-green-100" : ""}
        capitalize py-1 px-2 rounded-lg -ml-2
      `}
          >
            {status.replace(/_/g, " ").toLowerCase()}
          </span>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Status</SelectLabel>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="STAGE_1_APPROVED">Stage 1</SelectItem>
            <SelectItem value="STAGE_2_APPROVED">Stage 2</SelectItem>
            <SelectItem value="NOMINATED">Nominated</SelectItem>
            <SelectItem value="DECLINED">Declined</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleSave}>Save Changes</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onViewApplication(id)}>
            View Application
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

type ColumnsOptions = {
  onSelect: (id: string) => void;
};

export const columns = ({ onSelect }: ColumnsOptions): ColumnDef<Awards>[] => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div>{row.original.id.slice(0, 8)}</div>,
  },
  {
    id: "username",
    accessorFn: (row) => row.user.name,
    header: "Name",
    cell: ({ row }) => <div>{row.original.user.name}</div>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <StatusTab
        title={row.original.role === "HELP_SEEKER" ? "Help Seeker" : "NGO"}
        color={row.original.role === "HELP_SEEKER" ? "PRIMARY" : "ORANGE"}
      />
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => (
      <div>{format(new Date(row.original.updatedAt), "PPP")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusActionCell
        id={row.original.id}
        initialStatus={row.original.status}
        onViewApplication={onSelect}
      />
    ),
  },
];
