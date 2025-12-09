import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type JobStatus = "Scheduled" | "In Progress" | "Completed" | "Canceled";

interface JobStatusDropdownProps {
  status: JobStatus;
  onChange: (newStatus: JobStatus) => void;
  className?: string;
}

const statusConfig: Record<JobStatus, { color: string; bgColor: string; borderColor: string }> = {
  "Scheduled": {
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
  "In Progress": {
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
  },
  "Completed": {
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  "Canceled": {
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
};

export const JobStatusDropdown: React.FC<JobStatusDropdownProps> = ({
  status,
  onChange,
  className,
}) => {
  const config = statusConfig[status];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <button
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-1",
            config.bgColor,
            config.color,
            config.borderColor,
            className
          )}
        >
          <span>{status}</span>
          <ChevronDown className="h-3 w-3 opacity-60" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-44 p-1 animate-in fade-in-0 zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {(Object.keys(statusConfig) as JobStatus[]).map((statusOption) => {
          const optionConfig = statusConfig[statusOption];
          const isSelected = statusOption === status;

          return (
            <DropdownMenuItem
              key={statusOption}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-all",
                "hover:bg-accent focus:bg-accent",
                isSelected && optionConfig.bgColor,
                "data-[highlighted]:bg-accent"
              )}
              onClick={(e) => {
                e.stopPropagation();
                if (statusOption !== status) {
                  onChange(statusOption);
                }
              }}
            >
              <div className={cn("flex items-center gap-2 flex-1 min-w-0")}>
                <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                  {isSelected && (
                    <Check className={cn("h-4 w-4", optionConfig.color)} />
                  )}
                </div>
                <span className={cn("text-sm font-medium flex-1", optionConfig.color)}>
                  {statusOption}
                </span>
                <div
                  className={cn(
                    "w-2.5 h-2.5 rounded-full flex-shrink-0",
                    optionConfig.bgColor,
                    optionConfig.borderColor,
                    "border"
                  )}
                />
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

