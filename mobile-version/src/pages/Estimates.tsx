import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileHeader from "@/components/layout/MobileHeader";
import EstimateCard from "@/components/cards/EstimateCard";
import EmptyState from "@/components/cards/EmptyState";
import { mockEstimates } from "@/data/mobileMockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, FileText, DollarSign, CreditCard, CheckCircle, MoreVertical, Eye, Mail, MessageSquare, Edit, MapPin, UserCog, History, X, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Estimates = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("activate");
  
  const filteredEstimates = mockEstimates.filter(est => {
    const matchesSearch = est.id.toLowerCase().includes(search.toLowerCase()) ||
                         est.customerName.toLowerCase().includes(search.toLowerCase());
    // Filter by tab
    // Activate: Both Paid and Unpaid estimates
    // Deactivated: Only Unpaid estimates
    if (statusFilter === "activate") {
      return matchesSearch; // Show all estimates in activate tab
    } else {
      return matchesSearch && est.status === "Unpaid"; // Show only Unpaid in deactivated tab
    }
  });

  const handlePayNow = (estimateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success("Redirecting to payment...");
    navigate(`/invoices/new?estimateId=${estimateId}`);
  };

  const handleActivate = (estimateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success("Estimate activated successfully");
  };

  const handleMenuAction = (action: string, estimateId: string) => {
    switch (action) {
      case "preview":
        navigate(`/estimates/${estimateId}`);
        break;
      case "send-email":
        toast.success("Email sent successfully");
        break;
      case "send-sms":
        toast.success("SMS sent successfully");
        break;
      case "edit":
        navigate(`/estimates/${estimateId}/edit`);
        break;
      case "share-address":
        toast.success("Job address shared");
        break;
      case "reassign":
        toast.success("Employee reassigned");
        break;
      case "customer-history":
        toast.success("Opening customer history...");
        break;
      case "deactivate":
        toast.success("Estimate deactivated");
        break;
      case "refund":
        toast.success("Processing refund...");
        break;
      default:
        break;
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <MobileHeader 
        title="Estimates"
        showBack={true}
        actions={
          <Button size="sm" onClick={() => navigate("/estimates/new")}>
            <Plus className="h-4 w-4" />
          </Button>
        }
      />
      
      <div className="flex-1 overflow-y-auto scrollable px-4 pb-6 space-y-4" style={{ paddingTop: 'calc(3.5rem + env(safe-area-inset-top) + 0.5rem)' }}>
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

        {/* Status Tabs */}
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="activate">Activate</TabsTrigger>
            <TabsTrigger value="deactivated">Deactivated</TabsTrigger>
          </TabsList>

          <TabsContent value={statusFilter} className="mt-4 space-y-3">
            {filteredEstimates.length > 0 ? (
              filteredEstimates.map(estimate => (
                <EstimateCard 
                  key={estimate.id}
                  estimate={estimate}
                  onClick={() => navigate(`/estimates/${estimate.id}`)}
                  actionButtons={
                    statusFilter === "activate" && estimate.status === "Unpaid" ? (
                      <>
                        <Button
                          size="sm"
                          variant="default"
                          className="h-8 px-3 text-xs font-semibold touch-target whitespace-nowrap bg-primary hover:bg-primary/90 shadow-sm hover:shadow-md transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePayNow(estimate.id, e);
                          }}
                        >
                          <CreditCard className="h-3.5 w-3.5 mr-1.5" />
                          Pay Now
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 touch-target"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem onClick={() => handleMenuAction("preview", estimate.id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Preview estimate
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleMenuAction("send-email", estimate.id)}>
                              <Mail className="h-4 w-4 mr-2" />
                              Send email
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleMenuAction("send-sms", estimate.id)}>
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Send SMS
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleMenuAction("edit", estimate.id)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit estimate
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleMenuAction("share-address", estimate.id)}>
                              <MapPin className="h-4 w-4 mr-2" />
                              Share job address
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleMenuAction("reassign", estimate.id)}>
                              <UserCog className="h-4 w-4 mr-2" />
                              Reassign employee
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleMenuAction("customer-history", estimate.id)}>
                              <History className="h-4 w-4 mr-2" />
                              Customer history
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleMenuAction("deactivate", estimate.id)}
                              className="text-destructive"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Deactivate
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    ) : statusFilter === "activate" && estimate.status === "Paid" ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 touch-target"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuItem onClick={() => handleMenuAction("preview", estimate.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleMenuAction("refund", estimate.id)}>
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Refund
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : statusFilter === "deactivated" && estimate.status === "Unpaid" ? (
                      <Button
                        size="sm"
                        variant="default"
                        className="h-7 px-3 text-xs touch-target"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActivate(estimate.id, e);
                        }}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Activate
                      </Button>
                    ) : undefined
                  }
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
