import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Calendar, Eye } from "lucide-react";
import { mockAgreements } from "@/data/mockData";
import { AddAgreementModal } from "@/components/modals/AddAgreementModal";

const Agreements = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [addAgreementOpen, setAddAgreementOpen] = useState(false);

  const filteredAgreements = mockAgreements.filter((agreement) =>
    agreement.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agreement.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agreement.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-success/10 text-success border-success/20";
      case "Expired":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "Pending":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="flex-1">
      <AppHeader searchPlaceholder="Search agreements..." onSearchChange={setSearchQuery} />

      <main className="px-6 py-6 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Agreements</h1>
              <p className="text-muted-foreground">Manage service contracts and agreements</p>
            </div>
            <Button className="gap-2" onClick={() => setAddAgreementOpen(true)}>
              <Plus className="h-5 w-5" />
              New Agreement
            </Button>
          </div>

        <div className="grid gap-4">
          {filteredAgreements.map((agreement) => (
            <Card key={agreement.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-4 bg-gradient-to-r from-card to-success/5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">{agreement.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {agreement.id} • {agreement.customerName}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="border-border">{agreement.type}</Badge>
                    <Badge className={getStatusColor(agreement.status)} variant="outline">{agreement.status}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <p className="text-muted-foreground text-xs flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Start Date
                    </p>
                    <p className="font-medium mt-1">{new Date(agreement.startDate).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <p className="text-muted-foreground text-xs flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      End Date
                    </p>
                    <p className="font-medium mt-1">{new Date(agreement.endDate).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
                    <p className="text-primary text-xs">Annual Value</p>
                    <p className="text-2xl font-bold text-primary">${agreement.amount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="border-t pt-4 bg-muted/10 -mx-6 px-6 py-3 rounded-b-lg">
                  <p className="text-sm font-medium mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Terms & Conditions:
                  </p>
                  <div className="bg-card p-4 rounded-lg border border-border/50 text-sm">
                    {agreement.terms}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary">
                    <Eye className="h-4 w-4" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">Renew</Button>
                  <Button size="sm" className="ml-auto">Edit Agreement</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <AddAgreementModal open={addAgreementOpen} onOpenChange={setAddAgreementOpen} />
    </div>
  );
};

export default Agreements;
