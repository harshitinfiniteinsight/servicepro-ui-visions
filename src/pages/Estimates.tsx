import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Mail, MessageSquare, DollarSign, Banknote, MapPin, UserCog, FileText, XCircle, MoreVertical, RotateCcw, CheckCircle, FileCheck } from "lucide-react";
import { mockEstimates, mockEmployees } from "@/data/mockData";
import { SendEmailModal } from "@/components/modals/SendEmailModal";
import { SendSMSModal } from "@/components/modals/SendSMSModal";
import { PayCashModal } from "@/components/modals/PayCashModal";
import { EstimateFormModal } from "@/components/modals/EstimateFormModal";
import { InvoicePaymentModal } from "@/components/modals/InvoicePaymentModal";
import { LinkModulesModal } from "@/components/modals/LinkModulesModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const Estimates = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [statusFilter, setStatusFilter] = useState("All");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [smsModalOpen, setSmsModalOpen] = useState(false);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [selectedEstimate, setSelectedEstimate] = useState<any>(null);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [payCashModalOpen, setPayCashModalOpen] = useState(false);
  const [estimateFormOpen, setEstimateFormOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedEstimateForPayment, setSelectedEstimateForPayment] = useState<any>(null);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkTargetModule, setLinkTargetModule] = useState<"invoice" | "agreement">("invoice");
  const [selectedEstimateForLink, setSelectedEstimateForLink] = useState<any>(null);
  const { toast } = useToast();

  const filteredEstimates = mockEstimates.filter((estimate) => {
    const matchesActive = activeTab === "active" 
      ? estimate.isActive 
      : !estimate.isActive && estimate.status === "Open";
    
    const matchesSearch = 
      estimate.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      estimate.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      estimate.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || estimate.status === statusFilter;
    
    const estimateDate = new Date(estimate.createdDate);
    const matchesDateRange = 
      (!startDate || estimateDate >= new Date(startDate)) &&
      (!endDate || estimateDate <= new Date(endDate));
    
    return matchesActive && matchesSearch && matchesStatus && matchesDateRange;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-success/10 text-success border-success/20";
      case "Open":
        return "bg-info/10 text-info border-info/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleSendEmail = (estimate: any) => {
    setSelectedEstimate(estimate);
    setEmailModalOpen(true);
  };

  const handleSendSMS = (estimate: any) => {
    setSelectedEstimate(estimate);
    setSmsModalOpen(true);
  };

  const handleReassign = (estimate: any) => {
    setSelectedEstimate(estimate);
    setReassignModalOpen(true);
  };

  const handleReassignSubmit = () => {
    toast({
      title: "Employee Reassigned",
      description: `Estimate ${selectedEstimate?.id} has been reassigned.`,
    });
    setReassignModalOpen(false);
    setSelectedEmployee("");
  };

  const handlePayEstimate = (estimate: any) => {
    setSelectedEstimateForPayment(estimate);
    setPaymentModalOpen(true);
  };

  const handlePayCash = (estimate: any) => {
    setSelectedEstimate(estimate);
    setPayCashModalOpen(true);
  };

  const handleShareAddress = (estimate: any) => {
    toast({
      title: "Address Shared",
      description: `Job address shared for ${estimate.id}`,
    });
  };

  const handleDeactivate = (estimate: any) => {
    toast({
      title: "Estimate Deactivated",
      description: `${estimate.id} has been deactivated.`,
    });
  };

  const handleActivate = (estimate: any) => {
    toast({
      title: "Estimate Activated",
      description: `${estimate.id} has been activated.`,
    });
  };

  const handleRefund = (estimate: any) => {
    toast({
      title: "Refund Processing",
      description: `Processing refund for ${estimate.id}`,
    });
  };

  const handleLinkModule = (estimate: any, targetModule: "invoice" | "agreement") => {
    setSelectedEstimateForLink(estimate);
    setLinkTargetModule(targetModule);
    setLinkModalOpen(true);
  };

  return (
    <div className="flex-1">
      <AppHeader searchPlaceholder="Search estimates..." onSearchChange={setSearchQuery} />

      <main className="px-6 py-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Estimates</h1>
            <p className="text-muted-foreground">Manage service estimates and proposals</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setEstimateFormOpen(true)} className="gap-2">
              <Plus className="h-5 w-5" />
              New Estimate
            </Button>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total Estimates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockEstimates.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Estimates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {mockEstimates.filter((estimate) => estimate.isActive).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending Estimates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">
                {mockEstimates.filter((estimate) => estimate.status === "Open").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {filteredEstimates.map((estimate) => (
                <Card key={estimate.id} className="shadow-md hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{estimate.title}</CardTitle>
                    <Badge variant="secondary">{estimate.status}</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      Customer: {estimate.customerName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Created: {estimate.createdDate}
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-lg font-bold">
                        ${estimate.amount.toLocaleString()}
                      </div>
                      <Badge className={getStatusColor(estimate.status)}>
                        {estimate.status}
                      </Badge>
                    </div>
                    <div className="flex justify-end mt-4 space-x-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleSendEmail(estimate)}>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSendSMS(estimate)}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Send SMS
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleReassign(estimate)}>
                            <UserCog className="mr-2 h-4 w-4" />
                            Reassign Employee
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleShareAddress(estimate)}>
                            <MapPin className="mr-2 h-4 w-4" />
                            Share Address
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePayEstimate(estimate)}>
                            <DollarSign className="mr-2 h-4 w-4" />
                            Pay Now
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePayCash(estimate)}>
                            <Banknote className="mr-2 h-4 w-4" />
                            Pay Cash
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeactivate(estimate)}>
                            <XCircle className="mr-2 h-4 w-4" />
                            Deactivate
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRefund(estimate)}>
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Process Refund
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleLinkModule(estimate, "invoice")}>
                            <FileText className="mr-2 h-4 w-4" />
                            Link Invoice
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleLinkModule(estimate, "agreement")}>
                            <FileCheck className="mr-2 h-4 w-4" />
                            Link Agreement
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="pending">
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {filteredEstimates.map((estimate) => (
                <Card key={estimate.id} className="shadow-md hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{estimate.title}</CardTitle>
                    <Badge variant="secondary">{estimate.status}</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      Customer: {estimate.customerName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Created: {estimate.createdDate}
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-lg font-bold">
                        ${estimate.amount.toLocaleString()}
                      </div>
                      <Badge className={getStatusColor(estimate.status)}>
                        {estimate.status}
                      </Badge>
                    </div>
                    <div className="flex justify-end mt-4 space-x-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleSendEmail(estimate)}>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSendSMS(estimate)}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Send SMS
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleReassign(estimate)}>
                            <UserCog className="mr-2 h-4 w-4" />
                            Reassign Employee
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleShareAddress(estimate)}>
                            <MapPin className="mr-2 h-4 w-4" />
                            Share Address
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePayEstimate(estimate)}>
                            <DollarSign className="mr-2 h-4 w-4" />
                            Pay Now
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePayCash(estimate)}>
                            <Banknote className="mr-2 h-4 w-4" />
                            Pay Cash
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleActivate(estimate)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Activate
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleLinkModule(estimate, "invoice")}>
                            <FileText className="mr-2 h-4 w-4" />
                            Link Invoice
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleLinkModule(estimate, "agreement")}>
                            <FileCheck className="mr-2 h-4 w-4" />
                            Link Agreement
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <InvoicePaymentModal
        open={paymentModalOpen}
        onOpenChange={setPaymentModalOpen}
        invoice={selectedEstimateForPayment}
      />
      <LinkModulesModal
        open={linkModalOpen}
        onOpenChange={setLinkModalOpen}
        sourceModule="estimate"
        sourceId={selectedEstimateForLink?.id || ""}
        sourceName={selectedEstimateForLink?.id || ""}
        targetModule={linkTargetModule}
      />
    </div>
  );
};

export default Estimates;
