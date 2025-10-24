import { Logo } from "@/components/Logo";
import { Navigation } from "@/components/Navigation";
import { StatCard } from "@/components/StatCard";
import { CustomerCard } from "@/components/CustomerCard";
import { QuickActions } from "@/components/QuickActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, FileText, Users, DollarSign, Search, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-muted/30">
      <Navigation />
      
      <div className="flex-1 pb-20 md:pb-6">
        {/* Header */}
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
                placeholder="Search customers, jobs, or invoices..." 
                className="pl-11 h-12 bg-background border-border"
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-4 md:px-8 py-6 space-y-8 animate-fade-in">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Welcome back, John! 👋
            </h1>
            <p className="text-muted-foreground text-lg">
              Here's what's happening with your business today
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Active Jobs"
              value={12}
              icon={FileText}
              trend={{ value: "+12%", positive: true }}
              color="primary"
            />
            <StatCard
              title="Today's Revenue"
              value="$3,450"
              icon={DollarSign}
              trend={{ value: "+8%", positive: true }}
              color="success"
            />
            <StatCard
              title="Scheduled"
              value={8}
              icon={Calendar}
              color="accent"
            />
            <StatCard
              title="Customers"
              value={124}
              icon={Users}
              trend={{ value: "+3", positive: true }}
              color="warning"
            />
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
                {[
                  { id: "J-001", customer: "Sarah Johnson", status: "In Progress", amount: "$450" },
                  { id: "J-002", customer: "Mike Williams", status: "Scheduled", amount: "$320" },
                  { id: "J-003", customer: "Emma Davis", status: "Completed", amount: "$680" },
                ].map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                    <div>
                      <p className="font-semibold text-foreground">{job.id}</p>
                      <p className="text-sm text-muted-foreground">{job.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">{job.amount}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        job.status === "Completed" ? "bg-success/10 text-success" :
                        job.status === "In Progress" ? "bg-warning/10 text-warning" :
                        "bg-info/10 text-info"
                      }`}>
                        {job.status}
                      </span>
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
                  <CustomerCard
                    id="C-001"
                    name="Sarah Johnson"
                    email="sarah.j@email.com"
                    phone="+1 (555) 123-4567"
                    address="123 Main St, Boston, MA"
                    gender="F"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions Button */}
          <QuickActions />
        </main>
      </div>
    </div>
  );
};

export default Index;
