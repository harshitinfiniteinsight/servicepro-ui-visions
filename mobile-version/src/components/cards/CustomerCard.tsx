import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { statusColors } from "@/data/mobileMockData";

interface CustomerCardProps {
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: string;
    lastVisit: string;
    totalSpent: number;
  };
}

const CustomerCard = ({ customer }: CustomerCardProps) => {
  const navigate = useNavigate();
  const initials = customer.name.split(" ").map(n => n[0]).join("");

  return (
    <div
      className="p-4 rounded-xl border border-gray-200 bg-white active:scale-[0.98] transition-all duration-200 cursor-pointer hover:shadow-md hover:border-primary/30"
      onClick={() => navigate(`/customers/${customer.id}`)}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border-2 border-primary/20">
          <span className="font-bold text-primary text-lg">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold truncate">{customer.name}</h3>
            <Badge className={cn("text-xs", statusColors[customer.status])}>
              {customer.status}
            </Badge>
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


