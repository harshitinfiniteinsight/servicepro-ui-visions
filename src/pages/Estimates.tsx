import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Send, FileCheck, Eye } from "lucide-react";
import { mockEstimates } from "@/data/mockData";

const Estimates = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEstimates = mockEstimates.filter((estimate) =>
    estimate.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    estimate.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    estimate.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-success/10 text-success border-success/20";
      case "Sent":
        return "bg-info/10 text-info border-info/20";
      case "Draft":
        return "bg-muted text-muted-foreground border-border";
      case "Rejected":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
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
            <Button className="gap-2">
              <Plus className="h-5 w-5" />
              New Estimate
            </Button>
          </div>

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

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary">
                    <Eye className="h-4 w-4" />
                    View Details
                  </Button>
                  {estimate.status === "Sent" && (
                    <Button variant="outline" size="sm" className="gap-2 hover:bg-success/5 hover:text-success hover:border-success">
                      <FileCheck className="h-4 w-4" />
                      Mark Approved
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="gap-2">
                    <Send className="h-4 w-4" />
                    {estimate.status === "Approved" ? "Resend" : "Send"}
                  </Button>
                  <Button size="sm" className="ml-auto">Edit Estimate</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Estimates;
