import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { statusColors } from "@/data/mobileMockData";

interface InvoiceCardProps {
  invoice: {
    id: string;
    customerName: string;
    issueDate: string;
    dueDate: string;
    amount: number;
    status: string;
    paymentMethod: string;
  };
  onClick?: () => void;
}

const InvoiceCard = ({ invoice, onClick }: InvoiceCardProps) => {
  const isOverdue = invoice.status === "Overdue";
  const isPaid = invoice.status === "Paid";

  return (
    <div
      className="p-4 rounded-xl border bg-card active:scale-98 transition-transform cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold">{invoice.id}</span>
            <Badge className={cn("text-xs", statusColors[invoice.status])}>
              {invoice.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{invoice.customerName}</p>
        </div>
        <div className="text-right">
          <div className={cn(
            "text-xl font-bold",
            isPaid && "text-success",
            isOverdue && "text-destructive"
          )}>
            ${invoice.amount.toLocaleString()}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>Due: {new Date(invoice.dueDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <CreditCard className="h-3 w-3" />
          <span>{invoice.paymentMethod}</span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCard;


