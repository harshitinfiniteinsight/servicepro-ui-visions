import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileHeader from "@/components/layout/MobileHeader";
import InvoiceCard from "@/components/cards/InvoiceCard";
import EmptyState from "@/components/cards/EmptyState";
import { mockInvoices } from "@/data/mobileMockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, FileText, DollarSign } from "lucide-react";

const Invoices = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const filteredInvoices = mockInvoices.filter(inv => {
    const matchesSearch = inv.id.toLowerCase().includes(search.toLowerCase()) ||
                         inv.customerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || inv.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const summary = {
    total: mockInvoices.length,
    paid: mockInvoices.filter(i => i.status === "Paid").length,
    open: mockInvoices.filter(i => i.status === "Open").length,
    overdue: mockInvoices.filter(i => i.status === "Overdue").length,
    totalAmount: mockInvoices.reduce((sum, i) => sum + i.amount, 0),
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <MobileHeader 
        title="Invoices"
        showBack={true}
        actions={
          <Button size="sm" onClick={() => navigate("/invoices/new")}>
            <Plus className="h-4 w-4" />
          </Button>
        }
      />
      
      <div className="flex-1 overflow-y-auto scrollable px-4 pb-6 space-y-4" style={{ paddingTop: 'calc(3.5rem + env(safe-area-inset-top) + 0.5rem)' }}>
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search invoices..."
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
              <span className="text-xs font-medium">Total Amount</span>
            </div>
            <p className="text-xl font-bold">${summary.totalAmount.toLocaleString()}</p>
          </div>
        </div>

        {/* Status Tabs */}
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
          </TabsList>

          <TabsContent value={statusFilter} className="mt-4 space-y-3">
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map(invoice => (
                <InvoiceCard 
                  key={invoice.id} 
                  invoice={invoice}
                  onClick={() => navigate(`/invoices/${invoice.id}`)}
                />
              ))
            ) : (
              <EmptyState
                icon={<FileText className="h-10 w-10 text-muted-foreground" />}
                title="No invoices found"
                description="Try adjusting your search or filters"
                actionLabel="Create Invoice"
                onAction={() => navigate("/invoices/new")}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Invoices;
