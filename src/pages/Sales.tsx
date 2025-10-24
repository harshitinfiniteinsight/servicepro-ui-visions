import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, FileText, FileCheck, ClipboardList, Eye, Plus, TrendingUp } from "lucide-react";
import { InvoiceFormModal } from "@/components/modals/InvoiceFormModal";
import { StatCard } from "@/components/StatCard";
import { mockInvoices, mockEstimates, mockAgreements } from "@/data/mockData";

const Sales = () => {
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const totalInvoices = mockInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidInvoices = mockInvoices.filter(inv => inv.status === "Paid").length;
  const totalEstimates = mockEstimates.reduce((sum, est) => sum + est.amount, 0);
  const totalAgreements = mockAgreements.reduce((sum, agr) => sum + agr.amount, 0);

  const filteredInvoices = mockInvoices.filter((invoice) =>
    invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEstimates = mockEstimates.filter((estimate) =>
    estimate.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAgreements = mockAgreements.filter((agreement) =>
    agreement.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1">
      <AppHeader 
        searchPlaceholder="Search sales records..." 
        onSearchChange={setSearchQuery}
      />

      <main className="px-6 py-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              Sales Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage invoices, estimates, and agreements
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Invoices"
            value={`$${totalInvoices}`}
            icon={FileText}
            trend={{ value: "+12%", positive: true }}
            color="primary"
          />
          <StatCard
            title="Paid Invoices"
            value={paidInvoices}
            icon={FileCheck}
            trend={{ value: "+8%", positive: true }}
            color="success"
          />
          <StatCard
            title="Estimates Value"
            value={`$${totalEstimates}`}
            icon={ClipboardList}
            trend={{ value: "+15%", positive: true }}
            color="accent"
          />
          <StatCard
            title="Agreements Value"
            value={`$${totalAgreements}`}
            icon={TrendingUp}
            color="warning"
          />
        </div>

        <Tabs defaultValue="invoices" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="estimates">Estimates</TabsTrigger>
            <TabsTrigger value="agreements">Agreements</TabsTrigger>
          </TabsList>

          <TabsContent value="invoices" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">All Invoices</h2>
              <Button onClick={() => setInvoiceModalOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Invoice
              </Button>
            </div>

            <div className="space-y-4">
              {filteredInvoices.map((invoice) => (
                <Card key={invoice.id} className="border-0 shadow-md hover:shadow-xl transition-all group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">{invoice.id}</h3>
                            <Badge className={
                              invoice.status === "Paid" ? "bg-success/10 text-success border border-success/20" :
                              invoice.status === "Pending" ? "bg-warning/10 text-warning border border-warning/20" :
                              "bg-destructive/10 text-destructive border border-destructive/20"
                            }>
                              {invoice.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{invoice.customerName}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Issue: {invoice.issueDate} | Due: {invoice.dueDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Amount</p>
                          <p className="text-2xl font-bold text-primary">${invoice.amount}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="hover:bg-primary/10 transition-colors">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="estimates" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">All Estimates</h2>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Estimate
              </Button>
            </div>

            <div className="space-y-4">
              {filteredEstimates.map((estimate) => (
                <Card key={estimate.id} className="border-0 shadow-md hover:shadow-xl transition-all group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                          <FileCheck className="h-6 w-6 text-accent" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">{estimate.id}</h3>
                            <Badge className={
                              estimate.status === "Approved" ? "bg-success/10 text-success border border-success/20" :
                              estimate.status === "Sent" ? "bg-info/10 text-info border border-info/20" :
                              "bg-warning/10 text-warning border border-warning/20"
                            }>
                              {estimate.status}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium text-foreground">{estimate.title}</p>
                          <p className="text-sm text-muted-foreground">{estimate.customerName}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Valid until: {estimate.validUntil}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Amount</p>
                          <p className="text-2xl font-bold text-accent">${estimate.amount}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="hover:bg-accent/10 transition-colors">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="agreements" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">All Agreements</h2>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Agreement
              </Button>
            </div>

            <div className="space-y-4">
              {filteredAgreements.map((agreement) => (
                <Card key={agreement.id} className="border-0 shadow-md hover:shadow-xl transition-all group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-warning/20 to-warning/5 flex items-center justify-center">
                          <ClipboardList className="h-6 w-6 text-warning" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">{agreement.id}</h3>
                            <Badge className={
                              agreement.status === "Active" ? "bg-success/10 text-success border border-success/20" :
                              "bg-muted/10 text-muted-foreground border border-muted/20"
                            }>
                              {agreement.status}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium text-foreground">{agreement.title}</p>
                          <p className="text-sm text-muted-foreground">{agreement.customerName}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {agreement.startDate} to {agreement.endDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Amount</p>
                          <p className="text-2xl font-bold text-warning">${agreement.amount}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="hover:bg-warning/10 transition-colors">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <InvoiceFormModal open={invoiceModalOpen} onOpenChange={setInvoiceModalOpen} mode="create" />
      </main>
    </div>
  );
};

export default Sales;
