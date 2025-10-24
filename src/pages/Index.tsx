import { useState } from "react";
import { StatCard } from "@/components/StatCard";
import { AppHeader } from "@/components/AppHeader";
import { RevenueChart } from "@/components/charts/RevenueChart";
import { JobFormModal } from "@/components/modals/JobFormModal";
import { CustomerFormModal } from "@/components/modals/CustomerFormModal";
import { InvoiceFormModal } from "@/components/modals/InvoiceFormModal";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Users, DollarSign, TrendingUp, Briefcase, Eye, List } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockJobs } from "@/data/mockData";

const Index = () => {
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [jobTypeFilter, setJobTypeFilter] = useState("all");
  const [todayJobsView, setTodayJobsView] = useState<"list" | "calendar">("list");
  const [upcomingJobsView, setUpcomingJobsView] = useState<"list" | "calendar">("list");
  const [dateFilter, setDateFilter] = useState("all");

  const totalJobs = mockJobs.length;
  const activeJobs = mockJobs.filter(job => job.status !== "Completed").length;
  const todaysRevenue = mockJobs
    .filter(job => job.status === "In Progress")
    .reduce((sum, job) => sum + job.amount, 0);
  const scheduledAppointments = mockJobs.filter(job => job.status === "Scheduled").length;

  const upcomingJobs = mockJobs
    .filter(job => job.status === "Scheduled")
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());

  const filteredRecentJobs = mockJobs.filter(job => {
    const typeMatch = jobTypeFilter === "all" || job.type === jobTypeFilter;
    return typeMatch;
  }).slice(0, 5);

  return (
    <div className="flex-1">
      <AppHeader searchPlaceholder="Search customers, jobs, or invoices..." />

      <main className="px-6 py-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              Welcome back, John!
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your business today
            </p>
          </div>
          <Button onClick={() => setJobModalOpen(true)} size="lg" className="gap-2 shadow-lg">
            <FileText className="h-5 w-5" />
            Manage Job
          </Button>
        </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Jobs"
              value={totalJobs}
              icon={Briefcase}
              trend={{ value: "+15%", positive: true }}
              color="primary"
            />
            <StatCard
              title="Active Jobs"
              value={activeJobs}
              icon={FileText}
              trend={{ value: "+12%", positive: true }}
              color="success"
            />
            <StatCard
              title="Today's Revenue"
              value={`$${todaysRevenue}`}
              icon={DollarSign}
              trend={{ value: "+8%", positive: true }}
              color="warning"
            />
            <StatCard
              title="Scheduled Appointment"
              value={scheduledAppointments}
              icon={Calendar}
              trend={{ value: "+5", positive: true }}
              color="accent"
            />
          </div>

        {/* Charts Section */}
        <RevenueChart />

        {/* Recent Jobs & Upcoming Jobs */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Jobs */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <CardTitle>Today's job</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="flex items-center border rounded-lg p-1 gap-1">
                    <Button
                      variant={todayJobsView === "list" ? "default" : "ghost"}
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setTodayJobsView("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={todayJobsView === "calendar" ? "default" : "ghost"}
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setTodayJobsView("calendar")}
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm">View All</Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Job Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="invoice">Invoice</SelectItem>
                    <SelectItem value="estimate">Estimate</SelectItem>
                    <SelectItem value="agreement">Agreement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {todayJobsView === "list" ? (
                filteredRecentJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-card to-muted/20 rounded-lg border border-border hover:shadow-lg transition-all group">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-foreground">Job ID: {job.id}</p>
                        <Badge className="text-xs capitalize bg-primary/10 text-primary border border-primary/20">
                          {job.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Customer: {job.customerName}</p>
                      <p className="text-sm text-muted-foreground">Employee: {job.assignedTo}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-semibold text-primary mb-1">${job.amount}</p>
                        <Badge className={
                          job.status === "Completed" ? "bg-success/10 text-success border border-success/20" :
                          "bg-warning/10 text-warning border border-warning/20"
                        }>
                          {job.status === "Completed" ? "Paid" : "Open"}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="icon" className="hover:bg-primary/10 transition-colors">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="grid grid-cols-7 gap-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center text-xs font-semibold text-muted-foreground p-2">
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: 35 }, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - date.getDay() + i);
                    const dayJobs = filteredRecentJobs.filter(job => {
                      const jobDate = new Date(job.scheduledDate);
                      return jobDate.toDateString() === date.toDateString();
                    });
                    const isToday = date.toDateString() === new Date().toDateString();
                    
                    return (
                      <div
                        key={i}
                        className={`min-h-20 p-2 rounded-lg border ${
                          isToday ? "border-primary bg-primary/5" : "border-border bg-card"
                        } hover:shadow-md transition-all`}
                      >
                        <div className={`text-xs font-semibold mb-1 ${isToday ? "text-primary" : "text-muted-foreground"}`}>
                          {date.getDate()}
                        </div>
                        {dayJobs.slice(0, 2).map((job) => (
                          <div key={job.id} className="text-xs p-1 mb-1 bg-primary/10 rounded border border-primary/20">
                            <div className="font-semibold truncate">Job ID: {job.id}</div>
                            <div className="text-muted-foreground truncate">{job.customerName}</div>
                          </div>
                        ))}
                        {dayJobs.length > 2 && (
                          <div className="text-xs text-muted-foreground">+{dayJobs.length - 2}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Jobs */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Upcoming Jobs</span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center border rounded-lg p-1 gap-1">
                    <Button
                      variant={upcomingJobsView === "list" ? "default" : "ghost"}
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setUpcomingJobsView("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={upcomingJobsView === "calendar" ? "default" : "ghost"}
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setUpcomingJobsView("calendar")}
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm">View All</Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingJobsView === "list" ? (
                upcomingJobs.slice(0, 5).map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-accent/5 to-accent/10 rounded-lg border border-accent/20 hover:shadow-lg transition-all group">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">Job ID: {job.id}</p>
                          <p className="text-xs text-muted-foreground">Customer: {job.customerName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-12">
                        <Badge variant="outline" className="text-xs">{new Date(job.scheduledDate).toLocaleDateString()}</Badge>
                        <Badge className="text-xs capitalize bg-primary/10 text-primary border border-primary/20">
                          {job.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground ml-12 mt-1">Employee: {job.assignedTo}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-semibold text-accent">${job.amount}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="hover:bg-accent/10 transition-colors">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="grid grid-cols-7 gap-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center text-xs font-semibold text-muted-foreground p-2">
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: 35 }, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - date.getDay() + i);
                    const dayJobs = upcomingJobs.filter(job => {
                      const jobDate = new Date(job.scheduledDate);
                      return jobDate.toDateString() === date.toDateString();
                    });
                    const isToday = date.toDateString() === new Date().toDateString();
                    
                    return (
                      <div
                        key={i}
                        className={`min-h-20 p-2 rounded-lg border ${
                          isToday ? "border-accent bg-accent/5" : "border-border bg-card"
                        } hover:shadow-md transition-all`}
                      >
                        <div className={`text-xs font-semibold mb-1 ${isToday ? "text-accent" : "text-muted-foreground"}`}>
                          {date.getDate()}
                        </div>
                        {dayJobs.slice(0, 2).map((job) => (
                          <div key={job.id} className="text-xs p-1 mb-1 bg-accent/10 rounded border border-accent/20">
                            <div className="font-semibold truncate">Job ID: {job.id}</div>
                            <div className="text-muted-foreground truncate">{job.customerName}</div>
                          </div>
                        ))}
                        {dayJobs.length > 2 && (
                          <div className="text-xs text-muted-foreground">+{dayJobs.length - 2}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <JobFormModal open={jobModalOpen} onOpenChange={setJobModalOpen} mode="create" />
        <CustomerFormModal open={customerModalOpen} onOpenChange={setCustomerModalOpen} mode="create" />
        <InvoiceFormModal open={invoiceModalOpen} onOpenChange={setInvoiceModalOpen} mode="create" />
      </main>
    </div>
  );
};

export default Index;
