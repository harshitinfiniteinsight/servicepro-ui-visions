import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Mail, MessageSquare, DollarSign, Banknote, MapPin, UserCog, FileText, XCircle, MoreVertical, RotateCcw, CheckCircle } from "lucide-react";
import { mockEstimates, mockEmployees } from "@/data/mockData";
import { SendEmailModal } from "@/components/modals/SendEmailModal";
import { SendSMSModal } from "@/components/modals/SendSMSModal";
import { PayCashModal } from "@/components/modals/PayCashModal";
import { EstimateFormModal } from "@/components/modals/EstimateFormModal";
import { InvoicePaymentModal } from "@/components/modals/InvoicePaymentModal";
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
  const { toast } = useToast();

  const filteredEstimates = mockEstimates.filter((estimate) => {
    const matchesActive = activeTab === "active" 
      ? estimate.isActive 
      : !estimate.isActive && estimate.status === "Open"; // Only Open estimates in deactivated tab
    
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

  return (
    <div className="flex-1">
      <AppHeader searchPlaceholder="Search estimates..." onSearchChange={setSearchQuery} />

      <main className="px-6 py-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Estimates</h1>
            <p className="text-muted-foreground">Create and manage project estimates</p>
          </div>
          <Button className="gap-2" onClick={() => setEstimateFormOpen(true)}>
            <Plus className="h-5 w-5" />
            New Estimate
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="deactivated">Deactivated</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <Label>Start Date</Label>
                <Input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <Label>End Date</Label>
                <Input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Open">Open</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {(startDate || endDate) && (
              <div className="text-sm text-muted-foreground">
                Showing estimates from {startDate || "beginning"} to {endDate || "now"}
              </div>
            )}

            <div className="grid gap-4">
              {filteredEstimates.map((estimate) => (
                <Card key={estimate.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="pb-4 bg-gradient-to-r from-card to-accent/5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl flex items-center gap-2 mb-1">
                          {estimate.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {estimate.id} • {estimate.customerName}
                        </p>
                      </div>
                      <Badge className={getStatusColor(estimate.status)} variant="outline">{estimate.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-muted/30 p-3 rounded-lg">
                        <p className="text-muted-foreground text-xs">Created</p>
                        <p className="font-medium mt-1">{new Date(estimate.createdDate).toLocaleDateString()}</p>
                      </div>
                      <div className="bg-muted/30 p-3 rounded-lg">
                        <p className="text-muted-foreground text-xs">Valid Until</p>
                        <p className="font-medium mt-1">{new Date(estimate.validUntil).toLocaleDateString()}</p>
                      </div>
                      <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
                        <p className="text-primary text-xs">Total Amount</p>
                        <p className="text-2xl font-bold text-primary">${estimate.amount.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="border-t pt-4 bg-muted/10 -mx-6 px-6 py-3 rounded-b-lg">
                      <p className="text-sm font-medium mb-3">Line Items:</p>
                      <div className="space-y-2">
                        {estimate.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between text-sm bg-card p-3 rounded-lg border border-border/50">
                            <span className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-accent"></span>
                              {item.description} <span className="text-muted-foreground">(×{item.quantity})</span>
                            </span>
                            <span className="font-medium">${item.amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2 items-center">
                      <Button variant="outline" size="sm" className="gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary">
                        <Eye className="h-4 w-4" />
                        Preview Estimate
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="ml-auto">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          {estimate.status === "Paid" ? (
                            <DropdownMenuItem onClick={() => handleRefund(estimate)} className="gap-2">
                              <RotateCcw className="h-4 w-4" />
                              Refund
                            </DropdownMenuItem>
                          ) : (
                            <>
                              <DropdownMenuItem onClick={() => handleSendEmail(estimate)} className="gap-2">
                                <Mail className="h-4 w-4" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSendSMS(estimate)} className="gap-2">
                                <MessageSquare className="h-4 w-4" />
                                Send SMS
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2">
                                <FileText className="h-4 w-4" />
                                Edit Estimate
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handlePayEstimate(estimate)} className="gap-2">
                                <DollarSign className="h-4 w-4" />
                                Pay Estimate
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handlePayCash(estimate)} className="gap-2">
                                <Banknote className="h-4 w-4" />
                                Pay Cash
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleShareAddress(estimate)} className="gap-2">
                                <MapPin className="h-4 w-4" />
                                Share Job Address
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleReassign(estimate)} className="gap-2">
                                <UserCog className="h-4 w-4" />
                                Reassign Employee
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2">
                                <FileText className="h-4 w-4" />
                                Doc History
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeactivate(estimate)} className="gap-2 text-destructive">
                                <XCircle className="h-4 w-4" />
                                Deactivate
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="deactivated" className="space-y-6">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <Label>Start Date</Label>
                <Input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <Label>End Date</Label>
                <Input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {(startDate || endDate) && (
              <div className="text-sm text-muted-foreground">
                Showing estimates from {startDate || "beginning"} to {endDate || "now"}
              </div>
            )}

            <div className="grid gap-4">
              {filteredEstimates.map((estimate) => (
                <Card key={estimate.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Date</p>
                            <p className="font-medium">{new Date(estimate.createdDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Order ID</p>
                            <p className="font-medium">{estimate.id}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Customer Name</p>
                            <p className="font-medium">{estimate.customerName}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Employee Name</p>
                            <p className="font-medium">{estimate.employeeName}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Order Amount</p>
                            <p className="font-medium text-primary">${estimate.amount.toLocaleString()}</p>
                          </div>
                          <div>
                            <Badge className={getStatusColor(estimate.status)} variant="outline">{estimate.status}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Eye className="h-4 w-4" />
                        Preview Estimate
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2 hover:bg-success/10 hover:text-success hover:border-success"
                        onClick={() => handleActivate(estimate)}
                      >
                        <CheckCircle className="h-4 w-4" />
                        Activate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {selectedEstimate && (
          <>
            <SendEmailModal
              open={emailModalOpen}
              onOpenChange={setEmailModalOpen}
              customerEmail={selectedEstimate.customerEmail}
            />
            <SendSMSModal
              open={smsModalOpen}
              onOpenChange={setSmsModalOpen}
              customerName={selectedEstimate.customerName}
              phoneNumber={selectedEstimate.customerPhone}
            />
            <PayCashModal
              open={payCashModalOpen}
              onOpenChange={setPayCashModalOpen}
              orderAmount={selectedEstimate.amount}
              orderId={selectedEstimate.id}
            />
          </>
        )}

        <EstimateFormModal
          open={estimateFormOpen}
          onOpenChange={setEstimateFormOpen}
          mode="create"
        />

        <Dialog open={reassignModalOpen} onOpenChange={setReassignModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reassign Employee</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Select Employee</Label>
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockEmployees
                      .filter((emp) => emp.status === "Active")
                      .map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name} - {employee.role}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleReassignSubmit} className="w-full">
                Reassign
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <InvoicePaymentModal
          open={paymentModalOpen}
          onOpenChange={setPaymentModalOpen}
          invoice={selectedEstimateForPayment}
        />
      </main>
    </div>
  );
};

export default Estimates;
