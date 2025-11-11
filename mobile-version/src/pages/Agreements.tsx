import { useNavigate } from "react-router-dom";
import MobileHeader from "@/components/layout/MobileHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { mockAgreements } from "@/data/mobileMockData";
import { Plus, Calendar, DollarSign, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { statusColors } from "@/data/mobileMockData";
import { toast } from "sonner";

const Agreements = () => {
  const navigate = useNavigate();

  const handlePayNow = (agreementId: string) => {
    toast.success(`Initiating payment for ${agreementId}`);
  };

  const handleMenuAction = (agreementId: string, action: string) => {
    switch (action) {
      case "preview":
        navigate(`/agreements/${agreementId}`);
        break;
      case "send-email":
        toast.success(`Sending agreement email for ${agreementId}`);
        break;
      case "send-sms":
        toast.success(`Sending agreement SMS for ${agreementId}`);
        break;
      case "edit":
        navigate(`/agreements/${agreementId}/edit`);
        break;
      case "pay":
        handlePayNow(agreementId);
        break;
      default:
        break;
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <MobileHeader
        title="Agreements"
        actions={
          <Button size="sm" onClick={() => navigate("/agreements/new")}>
            <Plus className="h-4 w-4" />
          </Button>
        }
      />

      <div
        className="flex-1 overflow-y-auto scrollable px-4 pb-6 space-y-4"
        style={{ paddingTop: "calc(3.5rem + env(safe-area-inset-top) + 0.5rem)" }}
      >
        <div className="space-y-3">
          {mockAgreements.map(agreement => {
            const isPaid = agreement.status === "Paid";
            const menuItems = isPaid
              ? [
                  { label: "Preview Agreement", action: "preview" },
                ]
              : [
                  { label: "Preview", action: "preview" },
                  { label: "Send Email", action: "send-email" },
                  { label: "Send SMS", action: "send-sms" },
                  { label: "Edit Agreement", action: "edit" },
                  { label: "Pay", action: "pay" },
                ];

            return (
              <div
                key={agreement.id}
                className="p-4 rounded-xl border bg-card active:scale-98 transition-transform cursor-pointer"
                onClick={() => navigate(`/agreements/${agreement.id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{agreement.type}</h3>
                      <Badge className={cn("text-xs", statusColors[agreement.status])}>
                        {agreement.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{agreement.customerName}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(agreement.startDate).toLocaleDateString()} - {new Date(agreement.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-primary" />
                          <span className="text-xl font-bold">{agreement.monthlyAmount.toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground text-right">per month</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={e => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" sideOffset={4} className="w-44">
                        {menuItems.map(item => (
                          <DropdownMenuItem
                            key={item.action}
                            onSelect={() => handleMenuAction(agreement.id, item.action)}
                          >
                            {item.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Agreements;
