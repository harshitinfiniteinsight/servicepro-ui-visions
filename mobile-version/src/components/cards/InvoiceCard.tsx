import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { statusColors } from "@/data/mobileMockData";

interface InvoiceCardProps {
  invoice: {
    id: string;
    customerId: string;
    customerName: string;
    issueDate: string;
    dueDate: string;
    amount: number;
    status: string;
    paymentMethod: string;
    type?: "single" | "recurring" | "deactivated";
  };
  onClick?: () => void;
  payButton?: ReactNode;
  actionButtons?: ReactNode;
}

const InvoiceCard = ({ invoice, onClick, payButton, actionButtons }: InvoiceCardProps) => {
  const statusLabel = invoice.status === "Open" ? "Unpaid" : invoice.status;
  const isOverdue = statusLabel === "Overdue";
  const isPaid = statusLabel === "Paid";

  return (
    <div
      className="p-4 rounded-xl border border-gray-200 bg-white active:scale-[0.98] transition-all duration-200 cursor-pointer hover:shadow-md hover:border-primary/30"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold">{invoice.id}</span>
            <Badge className={cn("text-xs", statusColors[invoice.status])}>
              {statusLabel}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{invoice.customerName}</p>
        </div>
        <div className="text-right flex items-center gap-2 sm:gap-3">
          <div
            className={cn(
              "text-xl font-bold whitespace-nowrap",
              isPaid && "text-success",
              isOverdue && "text-destructive"
            )}
          >
            ${invoice.amount.toLocaleString()}
          </div>
          {payButton && (
            <div
              className="w-auto"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {payButton}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>Due: {new Date(invoice.dueDate).toLocaleDateString()}</span>
        </div>
        {actionButtons && (
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {actionButtons}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceCard;


