import { useState } from "react";
import { StatCard } from "@/components/StatCard";
import { CustomerCard } from "@/components/CustomerCard";
import { QuickActions } from "@/components/QuickActions";
import { AppHeader } from "@/components/AppHeader";
import { RevenueChart } from "@/components/charts/RevenueChart";
import { JobFormModal } from "@/components/modals/JobFormModal";
import { CustomerFormModal } from "@/components/modals/CustomerFormModal";
import { InvoiceFormModal } from "@/components/modals/InvoiceFormModal";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Users, DollarSign, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockCustomers, mockJobs } from "@/data/mockData";

const Index = () => {
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);

  const activeJobs = mockJobs.filter(job => job.status !== "Completed").length;
  const todaysRevenue = mockJobs
    .filter(job => job.status === "In Progress")
    .reduce((sum, job) => sum + job.amount, 0);
  const scheduledJobs = mockJobs.filter(job => job.status === "Scheduled").length;
  const totalCustomers = mockCustomers.length;

  return (
    <div className="flex-1">
      <AppHeader searchPlaceholder="Search customers, jobs, or invoices..." />

      <main className="px-6 py-6 space-y-6 animate-fade-in">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, John! 👋
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your business today
            </p>
          </div>
          <Button onClick={() => setJobModalOpen(true)} size="lg" className="gap-2">
            <FileText className="h-5 w-5" />
            New Job
          </Button>
        </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Active Jobs"
              value={activeJobs}
              icon={FileText}
              trend={{ value: "+12%", positive: true }}
              color="primary"
            />
            <StatCard
              title="Today's Revenue"
              value={`$${todaysRevenue}`}
              icon={DollarSign}
              trend={{ value: "+8%", positive: true }}
              color="success"
            />
            <StatCard
              title="Scheduled"
              value={scheduledJobs}
              icon={Calendar}
              color="accent"
            />
            <StatCard
              title="Customers"
              value={totalCustomers}
              icon={Users}
              trend={{ value: "+3", positive: true }}
              color="warning"
            />
          </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Growth Rate</p>
                    <p className="text-lg font-bold">+23.5%</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-accent/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Completion</p>
                    <p className="text-lg font-bold">2.3 days</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-success/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Satisfaction</p>
                    <p className="text-lg font-bold">98.2%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Customers */}
        <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Jobs */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recent Jobs</span>
                  <Button variant="ghost" size="sm">View All</Button>
                </CardTitle>
              </CardHeader>
            <CardContent className="space-y-4">
              {mockJobs.slice(0, 5).map((job) => (
                <div key={job.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-foreground">{job.title}</p>
                      <Badge variant="outline" className="text-xs">{job.id}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{job.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary mb-1">${job.amount}</p>
                    <Badge className={
                      job.status === "Completed" ? "bg-success/10 text-success" :
                      job.status === "In Progress" ? "bg-warning/10 text-warning" :
                      "bg-info/10 text-info"
                    }>
                      {job.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
            </Card>

            {/* Recent Customers */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recent Customers</span>
                  <Button variant="ghost" size="sm">View All</Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCustomers.slice(0, 1).map((customer) => (
                    <CustomerCard key={customer.id} {...customer} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

        <QuickActions />

        <JobFormModal open={jobModalOpen} onOpenChange={setJobModalOpen} mode="create" />
        <CustomerFormModal open={customerModalOpen} onOpenChange={setCustomerModalOpen} mode="create" />
        <InvoiceFormModal open={invoiceModalOpen} onOpenChange={setInvoiceModalOpen} mode="create" />
      </main>
    </div>
  );
};

export default Index;
