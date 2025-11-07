import { useParams, useNavigate } from "react-router-dom";
import MobileHeader from "@/components/layout/MobileHeader";
import { mockCustomers, mockInvoices, mockJobs } from "@/data/mobileMockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, Mail, MapPin, DollarSign, Calendar, Briefcase, FileText, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { statusColors } from "@/data/mobileMockData";

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const customer = mockCustomers.find(c => c.id === id);
  
  if (!customer) {
    return (
      <div className="h-full flex items-center justify-center">
        <p>Customer not found</p>
      </div>
    );
  }

  const customerInvoices = mockInvoices.filter(i => i.customerId === id).slice(0, 5);
  const customerJobs = mockJobs.filter(j => j.customerId === id).slice(0, 5);
  const initials = customer.name.split(" ").map(n => n[0]).join("");

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <MobileHeader 
        title="Customer Details"
        showBack={true}
        actions={
          <Button size="sm" variant="outline" onClick={() => navigate(`/customers/${id}/edit`)}>
            <Edit className="h-4 w-4" />
          </Button>
        }
      />
      
      <div className="flex-1 overflow-y-auto scrollable pt-14">
        {/* Hero Section */}
        <div className="p-6 bg-gradient-to-br from-primary/10 to-accent/5">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-3xl font-bold text-primary">{initials}</span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{customer.name}</h2>
              <Badge className={cn("mb-2", statusColors[customer.status])}>
                {customer.status}
              </Badge>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Member since {new Date(customer.joinedDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 p-4">
          <div className="p-4 rounded-xl bg-success/10 border border-success/20">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-success" />
              <span className="text-xs font-medium text-success">Total Spent</span>
            </div>
            <p className="text-2xl font-bold">${customer.totalSpent.toLocaleString()}</p>
          </div>
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-primary">Last Visit</span>
            </div>
            <p className="text-sm font-semibold">{new Date(customer.lastVisit).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 px-4 pb-4">
          <Button className="gap-2" onClick={() => window.location.href = `tel:${customer.phone}`}>
            <Phone className="h-4 w-4" />
            Call
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => window.location.href = `mailto:${customer.email}`}>
            <Mail className="h-4 w-4" />
            Email
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="info" className="px-4">
          <TabsList className="w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4 pb-6">
            <div className="space-y-3">
              <div className="p-4 rounded-xl border bg-card">
                <h3 className="font-semibold mb-3">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{customer.email}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-sm">{customer.address}</span>
                  </div>
                </div>
              </div>

              {customer.notes && (
                <div className="p-4 rounded-xl border bg-card">
                  <h3 className="font-semibold mb-2">Notes</h3>
                  <p className="text-sm text-muted-foreground">{customer.notes}</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-3 pb-6">
            {customerJobs.length > 0 ? (
              customerJobs.map(job => (
                <div key={job.id} className="p-4 rounded-xl border bg-card">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold">{job.title}</h4>
                      <p className="text-sm text-muted-foreground">{new Date(job.date).toLocaleDateString()}</p>
                    </div>
                    <Badge className={cn("text-xs", statusColors[job.status])}>{job.status}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Briefcase className="h-3 w-3" />
                    <span>{job.technicianName}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No jobs found</p>
            )}
          </TabsContent>

          <TabsContent value="invoices" className="space-y-3 pb-6">
            {customerInvoices.length > 0 ? (
              customerInvoices.map(invoice => (
                <div key={invoice.id} className="p-4 rounded-xl border bg-card">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold">{invoice.id}</h4>
                      <p className="text-sm text-muted-foreground">Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={cn("text-xs mb-1", statusColors[invoice.status])}>{invoice.status}</Badge>
                      <p className="text-lg font-bold">${invoice.amount}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No invoices found</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CustomerDetails;
