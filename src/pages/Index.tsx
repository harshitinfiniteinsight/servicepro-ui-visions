import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Eye, 
  Plus, 
  FileText, 
  Briefcase, 
  Calendar,
  DollarSign,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const currentUser = "Joe"; // Mock user name

  // Mock data for stats
  const estimatesData = {
    new: 3,
    approved: { count: 2, amount: 2100 },
    changesRequested: 1,
    draft: { count: 2, amount: 1300 },
  };

  const jobsData = {
    requiresInvoicing: 0,
    actionRequired: 0,
    active: { count: 1, amount: 795 },
  };

  const invoicesData = {
    pastDue: 0,
    awaitingPayment: { count: 2, amount: 525 },
    draft: 0,
  };

  const appointmentsData = {
    total: { count: 1, amount: 795.00 },
    toGo: { count: 1, amount: 795.00 },
    active: { count: 0, amount: 0 },
    complete: { count: 0, amount: 0 },
  };

  const todaysAppointments = [
    {
      id: 1,
      time: "0:00",
      customer: "Sharon Mcdonald",
      type: "Anytime",
    },
  ];

  return (
    <div className="flex-1">
      <AppHeader searchPlaceholder="Search..." />

      <main className="px-6 py-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">
            Good morning, {currentUser}
          </h1>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Eye className="h-4 w-4" />
              View Insights
            </Button>
            <Button variant="outline" className="gap-2">
              More Actions
            </Button>
          </div>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard
            title="New Estimates"
            value={estimatesData.new}
            icon={FileText}
            color="primary"
            trend={{ value: "12% from last week", positive: true }}
          />
          <StatCard
            title="Active Jobs"
            value={jobsData.active.count}
            icon={Briefcase}
            color="accent"
            trend={{ value: `$${jobsData.active.amount}`, positive: true }}
          />
          <StatCard
            title="Awaiting Payment"
            value={invoicesData.awaitingPayment.count}
            icon={DollarSign}
            color="warning"
            trend={{ value: `$${invoicesData.awaitingPayment.amount}`, positive: false }}
          />
          <StatCard
            title="Today's Appointments"
            value={appointmentsData.total.count}
            icon={Calendar}
            color="success"
            trend={{ value: `$${appointmentsData.total.amount.toFixed(2)}`, positive: true }}
          />
        </div>

        {/* Detailed Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Estimates Detail */}
          <Card className="shadow-md border-border">
            <CardHeader className="pb-4 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  Estimates
                </CardTitle>
                <Button size="sm" variant="default" onClick={() => navigate("/estimates")}>
                  <Plus className="h-4 w-4 mr-1" />
                  New
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Approved</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">{estimatesData.approved.count}</div>
                  <div className="text-xs text-muted-foreground">${estimatesData.approved.amount.toLocaleString()}</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Changes Requested</span>
                </div>
                <div className="font-bold">{estimatesData.changesRequested}</div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Draft</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">{estimatesData.draft.count}</div>
                  <div className="text-xs text-muted-foreground">${estimatesData.draft.amount.toLocaleString()}</div>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-2" onClick={() => navigate("/estimates")}>
                View All Estimates
              </Button>
            </CardContent>
          </Card>

          {/* Jobs Detail */}
          <Card className="shadow-md border-border">
            <CardHeader className="pb-4 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Briefcase className="h-5 w-5 text-accent" />
                  </div>
                  Jobs
                </CardTitle>
                <Button size="sm" variant="default" onClick={() => navigate("/jobs")}>
                  <Plus className="h-4 w-4 mr-1" />
                  New
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Requires Invoicing</span>
                </div>
                <div className="font-bold">{jobsData.requiresInvoicing}</div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-warning" />
                  <span className="text-sm font-medium">Action Required</span>
                </div>
                <div className="font-bold">{jobsData.actionRequired}</div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">Active</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">{jobsData.active.count}</div>
                  <div className="text-xs text-muted-foreground">${jobsData.active.amount.toLocaleString()}</div>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-2" onClick={() => navigate("/jobs")}>
                View All Jobs
              </Button>
            </CardContent>
          </Card>

          {/* Invoices Detail */}
          <Card className="shadow-md border-border">
            <CardHeader className="pb-4 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-warning/10">
                    <DollarSign className="h-5 w-5 text-warning" />
                  </div>
                  Invoices
                </CardTitle>
                <Button size="sm" variant="default" onClick={() => navigate("/invoices")}>
                  <Plus className="h-4 w-4 mr-1" />
                  New
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 hover:bg-destructive/20 transition-colors">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-medium">Past Due</span>
                </div>
                <div className="font-bold text-destructive">{invoicesData.pastDue}</div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Awaiting Payment</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">{invoicesData.awaitingPayment.count}</div>
                  <div className="text-xs text-muted-foreground">${invoicesData.awaitingPayment.amount.toLocaleString()}</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Draft</span>
                </div>
                <div className="font-bold">{invoicesData.draft}</div>
              </div>

              <Button variant="outline" className="w-full mt-2" onClick={() => navigate("/invoices")}>
                View All Invoices
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section - Today's Appointments and Payments */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Today's Appointments */}
          <Card className="shadow-md border-border">
            <CardHeader className="pb-4 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-success/10">
                    <Calendar className="h-5 w-5 text-success" />
                  </div>
                  Today's Appointments
                </CardTitle>
                <Button size="sm" variant="outline" onClick={() => navigate("/appointments/manage")}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {todaysAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                    <Avatar className="h-12 w-12 bg-primary">
                      <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                        {appointment.customer.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-semibold text-foreground">{appointment.customer}</div>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {appointment.type}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{appointment.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payments */}
          <Card className="shadow-md border-border">
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <div className="p-2 rounded-lg bg-success/10">
                  <DollarSign className="h-5 w-5 text-success" />
                </div>
                Payments
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <p className="text-xs font-semibold text-success uppercase">On Its Way</p>
                </div>
                <p className="text-xs text-muted-foreground mb-3">Expected on Oct 06, 2023</p>
                <div className="flex items-end justify-between">
                  <div className="text-2xl font-bold text-foreground">$320.33</div>
                  <Button size="sm" variant="outline" onClick={() => navigate("/reports")}>
                    View Reports
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <p className="text-xs font-semibold text-primary uppercase">Available Now</p>
                </div>
                <div className="flex items-end justify-between">
                  <div className="text-2xl font-bold text-foreground">$1,337.00</div>
                  <Button size="sm" variant="default">
                    Get it now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
