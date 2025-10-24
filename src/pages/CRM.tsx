import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Briefcase, Phone, Mail, MapPin, Eye, Plus } from "lucide-react";
import { CustomerFormModal } from "@/components/modals/CustomerFormModal";
import { JobFormModal } from "@/components/modals/JobFormModal";
import { mockCustomers, mockJobs } from "@/data/mockData";

const CRM = () => {
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomers = mockCustomers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredJobs = mockJobs.filter((job) =>
    job.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1">
      <AppHeader 
        searchPlaceholder="Search customers, jobs..." 
        onSearchChange={setSearchQuery}
      />

      <main className="px-6 py-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              Customer Relationship Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your customers and their jobs
            </p>
          </div>
        </div>

        <Tabs defaultValue="customers" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
          </TabsList>

          <TabsContent value="customers" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">All Customers</h2>
              <Button onClick={() => setCustomerModalOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Customer
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCustomers.map((customer) => (
                <Card key={customer.id} className="border-0 shadow-md hover:shadow-xl transition-all group">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-lg shadow-md">
                          {customer.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{customer.name}</h3>
                          <Badge variant="outline" className="text-xs mt-1">{customer.id}</Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">{customer.address}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border flex justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Total Jobs</p>
                        <p className="text-lg font-bold text-primary">{customer.totalJobs}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Revenue</p>
                        <p className="text-lg font-bold text-success">${customer.totalRevenue}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">All Jobs</h2>
              <Button onClick={() => setJobModalOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Job
              </Button>
            </div>

            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="border-0 shadow-md hover:shadow-xl transition-all group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          <Briefcase className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">{job.title}</h3>
                            <Badge variant="outline" className="text-xs">{job.id}</Badge>
                            <Badge className="text-xs capitalize bg-primary/10 text-primary border border-primary/20">
                              {job.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{job.customerName}</p>
                          <p className="text-xs text-muted-foreground mt-1">{job.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Amount</p>
                          <p className="text-lg font-bold text-primary">${job.amount}</p>
                          <Badge className={
                            job.status === "Completed" ? "bg-success/10 text-success border border-success/20" :
                            job.status === "In Progress" ? "bg-warning/10 text-warning border border-warning/20" :
                            "bg-info/10 text-info border border-info/20"
                          }>
                            {job.status}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
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

        <CustomerFormModal open={customerModalOpen} onOpenChange={setCustomerModalOpen} mode="create" />
        <JobFormModal open={jobModalOpen} onOpenChange={setJobModalOpen} mode="create" />
      </main>
    </div>
  );
};

export default CRM;
