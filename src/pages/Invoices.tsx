import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { InvoiceFormModal } from "@/components/modals/InvoiceFormModal";
import { SendEmailModal } from "@/components/modals/SendEmailModal";
import { SendSMSModal } from "@/components/modals/SendSMSModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus, Eye, Mail, MessageSquare, Edit, UserCog, FileText, CreditCard, Banknote, MoreVertical, Trash2, Check, X } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { mockInvoices } from "@/data/mockData";
import { toast } from "sonner";

const Invoices = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("2024-08-01");
  const [endDate, setEndDate] = useState("2024-10-27");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [smsModalOpen, setSmsModalOpen] = useState(false);
  const [selectedInvoiceForContact, setSelectedInvoiceForContact] = useState<any>(null);

  const filterInvoices = (type: "single" | "recurring" | "deactivated") => {
    return mockInvoices.filter((invoice) => {
      const matchesSearch = invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.orderId.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || invoice.status.toLowerCase() === statusFilter.toLowerCase();
      
      const invoiceDate = new Date(invoice.issueDate);
      const start = new Date(startDate);
      const end = new Date(endDate);
      const matchesDateRange = invoiceDate >= start && invoiceDate <= end;

      if (type === "deactivated") {
        return invoice.deactivated && matchesSearch && matchesStatus && matchesDateRange;
      }
      
      return !invoice.deactivated && invoice.invoiceType === type && matchesSearch && matchesStatus && matchesDateRange;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-success/10 text-success border-success/20";
      case "Open":
        return "bg-warning/10 text-warning border-warning/20";
      case "Overdue":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleDeactivate = (invoice: any) => {
    if (invoice.status !== "Open") {
      toast.error("Only Open invoices can be deactivated");
      return;
    }
    toast.success(`Invoice ${invoice.id} has been deactivated`);
  };

  const handleSendEmail = (invoice: any) => {
    setSelectedInvoiceForContact(invoice);
    setEmailModalOpen(true);
  };

  const handleSendSMS = (invoice: any) => {
    setSelectedInvoiceForContact(invoice);
    setSmsModalOpen(true);
  };

  const renderInvoiceTable = (invoices: any[]) => (
    <div className="bg-card rounded-lg border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Date</TableHead>
            <TableHead className="font-semibold">OrderID</TableHead>
            <TableHead className="font-semibold">Customer Name</TableHead>
            <TableHead className="font-semibold">Employee Name</TableHead>
            <TableHead className="font-semibold">Order Amount</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Refund</TableHead>
            <TableHead className="font-semibold">Sync</TableHead>
            <TableHead className="font-semibold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                No invoices found
              </TableCell>
            </TableRow>
          ) : (
            invoices.map((invoice) => (
              <TableRow key={invoice.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium">
                  {new Date(invoice.issueDate).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-primary font-mono text-sm">
                  {invoice.orderId}
                </TableCell>
                <TableCell className="text-info font-medium">
                  {invoice.customerName}
                </TableCell>
                <TableCell className="text-info">
                  {invoice.employeeName}
                </TableCell>
                <TableCell className="font-semibold text-success">
                  ${invoice.amount.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(invoice.status)} variant="outline">
                    {invoice.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className={invoice.refund === "Yes" ? "text-destructive" : "text-muted-foreground"}>
                    {invoice.refund}
                  </span>
                </TableCell>
                <TableCell>
                  {invoice.sync ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : (
                    <X className="h-4 w-4 text-muted-foreground" />
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem className="gap-2">
                        <Eye className="h-4 w-4" />
                        Preview invoice
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2" onClick={() => handleSendEmail(invoice)}>
                        <Mail className="h-4 w-4" />
                        Send email
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2" onClick={() => handleSendSMS(invoice)}>
                        <MessageSquare className="h-4 w-4" />
                        Send sms
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="gap-2"
                        onClick={() => {
                          setSelectedInvoice(invoice);
                          setModalOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                        Edit Invoice
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <UserCog className="h-4 w-4" />
                        Reassign Employee
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <FileText className="h-4 w-4" />
                        Doc History
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <CreditCard className="h-4 w-4" />
                        Pay Now
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <Banknote className="h-4 w-4" />
                        Pay Cash
                      </DropdownMenuItem>
                      {invoice.status === "Open" && !invoice.deactivated && (
                        <DropdownMenuItem 
                          className="gap-2 text-destructive focus:text-destructive"
                          onClick={() => handleDeactivate(invoice)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Deactivate
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="flex-1">
      <AppHeader searchPlaceholder="Search invoices..." onSearchChange={setSearchQuery} />

      <main className="px-6 py-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Service Pro911 - Invoices</h1>
            <p className="text-muted-foreground">Manage billing and payments</p>
          </div>
          <Button onClick={() => setModalOpen(true)} className="gap-2">
            <Plus className="h-5 w-5" />
            New Invoice
          </Button>
        </div>

        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Date Range</label>
            <div className="flex gap-2 items-center">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="max-w-[180px]"
              />
              <span className="text-muted-foreground">TO</span>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="max-w-[180px]"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="single" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="single">Single Invoices</TabsTrigger>
            <TabsTrigger value="recurring">Recurring Invoices</TabsTrigger>
            <TabsTrigger value="deactivated">Deactivated</TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="space-y-4">
            {renderInvoiceTable(filterInvoices("single"))}
          </TabsContent>

          <TabsContent value="recurring" className="space-y-4">
            {renderInvoiceTable(filterInvoices("recurring"))}
          </TabsContent>

          <TabsContent value="deactivated" className="space-y-4">
            {renderInvoiceTable(filterInvoices("deactivated"))}
          </TabsContent>
        </Tabs>

        <InvoiceFormModal 
          open={modalOpen} 
          onOpenChange={(open) => {
            setModalOpen(open);
            if (!open) setSelectedInvoice(null);
          }} 
          invoice={selectedInvoice}
          mode={selectedInvoice ? "edit" : "create"} 
        />

        <SendEmailModal
          open={emailModalOpen}
          onOpenChange={setEmailModalOpen}
          customerEmail=""
        />

        <SendSMSModal
          open={smsModalOpen}
          onOpenChange={setSmsModalOpen}
          customerName={selectedInvoiceForContact?.customerName || ""}
          phoneNumber=""
        />
      </main>
    </div>
  );
};

export default Invoices;
