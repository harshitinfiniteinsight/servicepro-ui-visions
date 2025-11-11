import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Phone, Mail, DollarSign, MoreHorizontal } from "lucide-react";

interface CustomerCardProps {
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: string;
    lastVisit: string;
    totalSpent: number;
    address?: string;
    notes?: string;
  };
  variant?: "default" | "deactivated";
  onActivate?: () => void;
  onQuickAction?: (action: string) => void;
}

const formatCustomerId = (id: string) => {
  const numeric = id.replace(/\D/g, "");
  if (numeric.length === 0) return `ID: C-${id}`;
  return `ID: C-${numeric.padStart(3, "0")}`;
};

const CustomerCard = ({ customer, variant = "default", onActivate, onQuickAction }: CustomerCardProps) => {
  const navigate = useNavigate();
  const initials = customer.name.split(" ").map(n => n[0]).join("");
  const isDeactivated =
    variant === "deactivated" ||
    customer.status === "Deactivated" ||
    customer.status === "Inactive";

  if (isDeactivated) {
    return (
      <div className="p-4 rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-muted flex items-center justify-center border border-gray-200">
            <span className="font-semibold text-gray-500 text-lg">{initials}</span>
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {formatCustomerId(customer.id)}
                </span>
                <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 h-9 px-4 rounded-xl border-green-500 text-green-600 hover:bg-green-50"
                onClick={onActivate}
              >
                Activate
              </Button>
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" />
                <span className="truncate">{customer.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" />
                <span className="truncate">{customer.phone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-4 rounded-xl border border-gray-200 bg-white active:scale-[0.98] transition-all duration-200 cursor-pointer hover:shadow-md hover:border-primary/30"
      onClick={() => navigate(`/customers/${customer.id}`)}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border-2 border-primary/20">
          <span className="font-bold text-primary text-lg">{initials}</span>
        </div>
        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold truncate">{customer.name}</h3>
            {onQuickAction && (
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
                <DropdownMenuContent align="end" sideOffset={4} className="w-52">
                  {[
                    { label: "Edit Customer", action: "edit" },
                    { label: "Send Email", action: "email" },
                    { label: "Send SMS", action: "sms" },
                    { label: "Memo", action: "memo" },
                    { label: "Setup Appointment", action: "appointment" },
                    { label: "Deactivate", action: "deactivate" },
                    { label: "Create Invoice", action: "create-invoice" },
                    { label: "Create Estimate", action: "create-estimate" },
                    { label: "Create Agreement", action: "create-agreement" },
                    { label: "Customer Details", action: "details" },
                  ].map(item => (
                    <DropdownMenuItem
                      key={item.action}
                      onSelect={() => onQuickAction(item.action)}
                    >
                      {item.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-3 w-3" />
              <span className="truncate">{customer.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-3 w-3" />
              <span className="truncate">{customer.email}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t">
            <span className="text-xs text-muted-foreground">
              Last visit: {new Date(customer.lastVisit).toLocaleDateString()}
            </span>
            <div className="flex items-center gap-1 text-sm font-semibold text-success">
              <DollarSign className="h-4 w-4" />
              {customer.totalSpent.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerCard;


