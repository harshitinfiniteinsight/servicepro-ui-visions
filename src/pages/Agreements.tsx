import { useState } from "react";
import { Logo } from "@/components/Logo";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Bell, Plus, FileText, Calendar } from "lucide-react";
import { mockAgreements } from "@/data/mockData";

const Agreements = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAgreements = mockAgreements.filter((agreement) =>
    agreement.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agreement.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agreement.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-success/10 text-success";
      case "Expired":
        return "bg-destructive/10 text-destructive";
      case "Pending":
        return "bg-warning/10 text-warning";
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
                placeholder="Search agreements..." 
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
              <h1 className="text-3xl font-bold text-foreground">Agreements</h1>
              <p className="text-muted-foreground">Manage service contracts and agreements</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-5 w-5" />
              New Agreement
            </Button>
          </div>

          <div className="grid gap-4">
            {filteredAgreements.map((agreement) => (
              <Card key={agreement.id} className="card-hover border-0 shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{agreement.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {agreement.id} • {agreement.customerName}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">{agreement.type}</Badge>
                      <Badge className={getStatusColor(agreement.status)}>{agreement.status}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Start Date</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">{new Date(agreement.startDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">End Date</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">{new Date(agreement.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Annual Value</p>
                      <p className="text-2xl font-bold text-primary">${agreement.amount.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-2">Terms & Conditions:</p>
                    <div className="bg-muted/50 p-3 rounded text-sm">
                      <FileText className="h-4 w-4 inline mr-2 text-muted-foreground" />
                      {agreement.terms}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm">View Details</Button>
                    <Button variant="outline" size="sm">Renew</Button>
                    <Button size="sm">Edit</Button>
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

export default Agreements;
