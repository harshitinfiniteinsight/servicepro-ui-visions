import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileHeader from "@/components/layout/MobileHeader";
import EstimateCard from "@/components/cards/EstimateCard";
import EmptyState from "@/components/cards/EmptyState";
import { mockEstimates } from "@/data/mobileMockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, FileText, DollarSign } from "lucide-react";

const Estimates = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const filteredEstimates = mockEstimates.filter(est => {
    const matchesSearch = est.id.toLowerCase().includes(search.toLowerCase()) ||
                         est.customerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || est.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const summary = {
    total: mockEstimates.length,
    draft: mockEstimates.filter(e => e.status === "Draft").length,
    sent: mockEstimates.filter(e => e.status === "Sent").length,
    approved: mockEstimates.filter(e => e.status === "Approved").length,
    totalValue: mockEstimates.reduce((sum, e) => sum + e.amount, 0),
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <MobileHeader 
        title="Estimates"
        actions={
          <Button size="sm" onClick={() => navigate("/estimates/new")}>
            <Plus className="h-4 w-4" />
          </Button>
        }
      />
      
      <div className="flex-1 overflow-y-auto scrollable pt-14 px-4 pb-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search estimates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium">Total</span>
            </div>
            <p className="text-2xl font-bold">{summary.total}</p>
          </div>
          <div className="p-4 rounded-xl bg-success/5 border border-success/20">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-success" />
              <span className="text-xs font-medium">Total Value</span>
            </div>
            <p className="text-xl font-bold">${summary.totalValue.toLocaleString()}</p>
          </div>
        </div>

        {/* Status Tabs */}
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList className="w-full grid grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value={statusFilter} className="mt-4 space-y-3">
            {filteredEstimates.length > 0 ? (
              filteredEstimates.map(estimate => (
                <EstimateCard 
                  key={estimate.id} 
                  estimate={estimate}
                  onClick={() => navigate(`/estimates/${estimate.id}`)}
                />
              ))
            ) : (
              <EmptyState
                icon={<FileText className="h-10 w-10 text-muted-foreground" />}
                title="No estimates found"
                description="Try adjusting your search or filters"
                actionLabel="Create Estimate"
                onAction={() => navigate("/estimates/new")}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Estimates;
