import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { InvoiceFormModal } from "@/components/modals/InvoiceFormModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Download, Send, Eye } from "lucide-react";
import { mockInvoices } from "@/data/mockData";

const Invoices = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const filteredInvoices = mockInvoices.filter((invoice) =>
    invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-success/10 text-success border-success/20";
      case "Pending":
        return "bg-warning/10 text-warning border-warning/20";
      case "Overdue":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="flex-1">
      <AppHeader searchPlaceholder="Search invoices..." onSearchChange={setSearchQuery} />

      <main className="px-6 py-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Invoices</h1>
            <p className="text-muted-foreground">Manage billing and payments</p>
          </div>
          <Button onClick={() => setModalOpen(true)} className="gap-2">
            <Plus className="h-5 w-5" />
            New Invoice
          </Button>
        </div>

        <div className="grid gap-4">
          {filteredInvoices.map((invoice) => (
            <Card key={invoice.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-4 bg-gradient-to-r from-card to-muted/20">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      {invoice.id}
                      <Badge className={getStatusColor(invoice.status)} variant="outline">{invoice.status}</Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{invoice.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold text-primary">${invoice.amount}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <p className="text-muted-foreground text-xs">Issue Date</p>
                    <p className="font-medium mt-1">{new Date(invoice.issueDate).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <p className="text-muted-foreground text-xs">Due Date</p>
                    <p className="font-medium mt-1">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                  </div>
                  {invoice.paidDate && (
                    <div className="bg-success/10 p-3 rounded-lg border border-success/20">
                      <p className="text-success text-xs">Paid Date</p>
                      <p className="font-medium mt-1 text-success">{new Date(invoice.paidDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
                    <p className="text-primary text-xs">Job ID</p>
                    <p className="font-medium mt-1 text-primary">{invoice.jobId}</p>
                  </div>
                </div>

                <div className="border-t pt-4 bg-muted/10 -mx-6 px-6 py-3 rounded-b-lg">
                  <p className="text-sm font-medium mb-3">Line Items:</p>
                  <div className="space-y-2">
                    {invoice.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-sm bg-card p-3 rounded-lg border border-border/50">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-primary"></span>
                          {item.description} <span className="text-muted-foreground">(×{item.quantity})</span>
                        </span>
                        <span className="font-medium">${item.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary">
                    <Eye className="h-4 w-4" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Send className="h-4 w-4" />
                    Send
                  </Button>
                  <Button 
                    size="sm" 
                    className="ml-auto"
                    onClick={() => {
                      setSelectedInvoice(invoice);
                      setModalOpen(true);
                    }}
                  >
                    Edit Invoice
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <InvoiceFormModal 
          open={modalOpen} 
          onOpenChange={(open) => {
            setModalOpen(open);
            if (!open) setSelectedInvoice(null);
          }} 
          invoice={selectedInvoice}
          mode={selectedInvoice ? "edit" : "create"} 
        />
      </main>
    </div>
  );
};

export default Invoices;
