import { useState } from "react";
import { Logo } from "@/components/Logo";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Bell, Plus, Send, FileCheck } from "lucide-react";
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
        return "bg-success/10 text-success";
      case "Sent":
        return "bg-info/10 text-info";
      case "Draft":
        return "bg-muted text-muted-foreground";
      case "Rejected":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-muted/30">
      <Navigation />
      
      <div className="flex-1 pb-20 md:pb-6">
        <header className="sticky top-0 z-30 bg-card border-b border-border backdrop-blur-sm bg-card/95">
          <div className="px-4 md:px-8 py-4">
            <div className="flex items-center justify-between mb-4">
              <Logo size="sm" />
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full"></span>
                </Button>
                <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-white font-semibold text-sm shadow-md">
                  JD
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search estimates..." 
                className="pl-11 h-12 bg-background border-border"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </header>

        <main className="px-4 md:px-8 py-6 space-y-6 animate-fade-in">
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
              <Card key={estimate.id} className="card-hover border-0 shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{estimate.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {estimate.id} • {estimate.customerName}
                      </p>
                    </div>
                    <Badge className={getStatusColor(estimate.status)}>{estimate.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Created</p>
                      <p className="font-medium">{new Date(estimate.createdDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Valid Until</p>
                      <p className="font-medium">{new Date(estimate.validUntil).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Amount</p>
                      <p className="text-2xl font-bold text-primary">${estimate.amount.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-2">Line Items:</p>
                    <div className="space-y-2">
                      {estimate.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm bg-muted/50 p-2 rounded">
                          <span>{item.description} (x{item.quantity})</span>
                          <span className="font-medium">${item.amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    {estimate.status === "Sent" && (
                      <Button variant="outline" size="sm" className="gap-2">
                        <FileCheck className="h-4 w-4" />
                        Mark Approved
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="gap-2">
                      <Send className="h-4 w-4" />
                      {estimate.status === "Approved" ? "Resend" : "Send"}
                    </Button>
                    <Button size="sm">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Estimates;
