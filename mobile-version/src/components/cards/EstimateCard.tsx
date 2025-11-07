import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { statusColors } from "@/data/mobileMockData";

interface EstimateCardProps {
  estimate: {
    id: string;
    customerName: string;
    date: string;
    amount: number;
    status: string;
    probability?: number;
  };
  onClick?: () => void;
}

const EstimateCard = ({ estimate, onClick }: EstimateCardProps) => {
  const showProbability = estimate.status === "Sent" && estimate.probability;

  return (
    <div
      className="p-4 rounded-xl border border-gray-200 bg-white active:scale-[0.98] transition-all duration-200 cursor-pointer hover:shadow-md hover:border-primary/30"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold">{estimate.id}</span>
            <Badge className={cn("text-xs", statusColors[estimate.status])}>
              {estimate.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{estimate.customerName}</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-primary">
            ${estimate.amount.toLocaleString()}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{new Date(estimate.date).toLocaleDateString()}</span>
        </div>
        {showProbability && (
          <div className="flex items-center gap-1 text-success">
            <TrendingUp className="h-3 w-3" />
            <span className="font-medium">{estimate.probability}% likely</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EstimateCard;


