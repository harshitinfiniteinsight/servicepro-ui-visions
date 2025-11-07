import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileHeader from "@/components/layout/MobileHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockAgreements } from "@/data/mobileMockData";
import { Plus, Calendar, DollarSign, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { statusColors } from "@/data/mobileMockData";

const Agreements = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredAgreements = mockAgreements.filter(agr =>
    statusFilter === "All" || agr.status === statusFilter
  );

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
      
      <div className="flex-1 overflow-y-auto scrollable px-4 pb-6 space-y-4" style={{ paddingTop: 'calc(3.5rem + env(safe-area-inset-top) + 0.5rem)' }}>
        {/* Filters */}
        <div className="flex gap-2">
          {["All", "Active", "Expiring Soon"].map(f => (
            <Button
              key={f}
              variant={statusFilter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(f)}
            >
              {f}
            </Button>
          ))}
        </div>

        {/* Summary */}
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-semibold">Total Agreements</span>
            </div>
            <span className="text-2xl font-bold text-primary">{filteredAgreements.length}</span>
          </div>
        </div>

        {/* Agreement Cards */}
        <div className="space-y-3">
          {filteredAgreements.map(agreement => (
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
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span className="text-xl font-bold">{agreement.monthlyAmount.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">per month</p>
                </div>
              </div>
              
              <div className="pt-3 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Renewal</span>
                  <Badge variant="outline" className="text-xs">
                    {agreement.renewalStatus}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Agreements;
