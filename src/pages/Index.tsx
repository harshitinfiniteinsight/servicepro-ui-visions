import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { AppHeader } from "@/components/AppHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { useIsTablet } from "@/hooks/use-tablet";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { 
  FileText, 
  Briefcase, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  ClipboardList,
  Users,
  UserCheck,
  Package,
  BarChart3,
  MapPinned,
  Plus,
  Clock,
  ArrowRight
} from "lucide-react";
import { mockEstimates, mockJobs, mockInvoices } from "@/data/mockData";

const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isMobileOrTablet = isMobile || isTablet;

  // Debug: Log tablet detection (remove in production)
  useEffect(() => {
    console.log('Dashboard - isTablet:', isTablet, 'window.innerWidth:', window.innerWidth);
  }, [isTablet]);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Initialize date range to "Today" (default behavior)
  const getTodayRange = () => {
    const today = new Date();
    const todayStart = new Date(today);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);
    return { from: todayStart, to: todayEnd };
  };

  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>(getTodayRange());

  // Helper function - must be defined before hooks
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Get today's date for filtering (used for default appointments)
  const today = new Date();
  const todayStart = new Date(today);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(today);
  todayEnd.setHours(23, 59, 59, 999);

  // Mock appointments data (matching ManageAppointments structure) - must be defined before hooks
  const mockAppointments = [
    {
      id: "APT-001",
      customerName: "Robert Miller",
      subject: "AC Maintenance",
      date: formatDateForInput(today),
      startTime: "01:00 PM",
      endTime: "02:00 PM",
      employee: "John Doe",
      status: "Active" as const,
    },
    {
      id: "APT-002",
      customerName: "Sarah Johnson",
      subject: "HVAC Maintenance Check",
      date: formatDateForInput(today),
      startTime: "09:00 AM",
      endTime: "10:00 AM",
      employee: "John Doe",
      status: "Active" as const,
    },
    {
      id: "APT-003",
      customerName: "Mike Williams",
      subject: "Plumbing Consultation",
      date: formatDateForInput(today),
      startTime: "11:00 AM",
      endTime: "12:00 PM",
      employee: "Jane Smith",
      status: "Active" as const,
    },
    {
      id: "APT-004",
      customerName: "Emily Davis",
      subject: "Electrical Inspection",
      date: formatDateForInput(today),
      startTime: "02:00 PM",
      endTime: "03:30 PM",
      employee: "John Doe",
      status: "Active" as const,
    },
  ];

  // Filter data based on date range - ALL HOOKS MUST BE BEFORE EARLY RETURN
  const filteredData = useMemo(() => {
    if (!dateRange.from || !dateRange.to) {
      return {
        estimates: [],
        jobs: [],
        invoices: [],
        appointments: [],
      };
    }

    const startDate = new Date(dateRange.from);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(dateRange.to);
    endDate.setHours(23, 59, 59, 999);

    // Filter estimates by createdDate
    const filteredEstimates = mockEstimates.filter((estimate) => {
      const estimateDate = new Date(estimate.createdDate);
      estimateDate.setHours(0, 0, 0, 0);
      return estimateDate >= startDate && estimateDate <= endDate && estimate.isActive;
    });

    // Filter jobs by scheduledDate
    const filteredJobs = mockJobs.filter((job) => {
      const jobDate = new Date(job.scheduledDate);
      jobDate.setHours(0, 0, 0, 0);
      return jobDate >= startDate && jobDate <= endDate && (job.status === "In Progress" || job.status === "Scheduled");
    });

    // Filter invoices by issueDate (awaiting payments = Open status)
    const filteredInvoices = mockInvoices.filter((invoice) => {
      const invoiceDate = new Date(invoice.issueDate);
      invoiceDate.setHours(0, 0, 0, 0);
      return invoiceDate >= startDate && invoiceDate <= endDate && invoice.status === "Open" && !invoice.deactivated;
    });

    // Filter appointments by date
    const filteredAppointments = mockAppointments.filter((apt) => {
      const aptDate = new Date(apt.date);
      aptDate.setHours(0, 0, 0, 0);
      return aptDate >= startDate && aptDate <= endDate && apt.status === "Active";
    });

    return {
      estimates: filteredEstimates,
      jobs: filteredJobs,
      invoices: filteredInvoices,
      appointments: filteredAppointments,
    };
  }, [dateRange]);

  // Calculate metrics from filtered data
  const metricsData = useMemo(() => {
    const awaitingPaymentsAmount = filteredData.invoices.reduce((sum, inv) => sum + inv.amount, 0);
    
    return {
      newEstimates: filteredData.estimates.length,
      activeJobs: filteredData.jobs.length,
      awaitingPayments: {
        count: filteredData.invoices.length,
        amount: awaitingPaymentsAmount
      },
      todaysAppointments: filteredData.appointments.length
    };
  }, [filteredData]);

  // Generate Recent Activity from filtered data
  const recentActivity = useMemo(() => {
    const activities: Array<{
      id: number;
      type: "estimate" | "invoice" | "job" | "appointment";
      action: string;
      customer: string;
      amount: string;
      time: string;
      icon: typeof FileText;
      color: string;
      date: Date;
    }> = [];

    // Add estimates
    filteredData.estimates.slice(0, 2).forEach((estimate, idx) => {
      activities.push({
        id: activities.length + 1,
        type: "estimate",
        action: "Created new estimate",
        customer: estimate.customerName,
        amount: `$${estimate.amount.toFixed(2)}`,
        time: formatDateForInput(new Date(estimate.createdDate)),
        icon: FileText,
        color: "text-primary",
        date: new Date(estimate.createdDate),
      });
    });

    // Add invoices
    filteredData.invoices.slice(0, 2).forEach((invoice, idx) => {
      activities.push({
        id: activities.length + 1,
        type: "invoice",
        action: "Invoice sent",
        customer: invoice.customerName,
        amount: `$${invoice.amount.toFixed(2)}`,
        time: formatDateForInput(new Date(invoice.issueDate)),
        icon: DollarSign,
        color: "text-success",
        date: new Date(invoice.issueDate),
      });
    });

    // Add jobs
    filteredData.jobs.slice(0, 2).forEach((job, idx) => {
      activities.push({
        id: activities.length + 1,
        type: "job",
        action: job.status === "Completed" ? "Job completed" : "Job scheduled",
        customer: job.customerName,
        amount: `$${job.amount.toFixed(2)}`,
        time: formatDateForInput(new Date(job.scheduledDate)),
        icon: Briefcase,
        color: "text-accent",
        date: new Date(job.scheduledDate),
      });
    });

    // Add appointments
    filteredData.appointments.slice(0, 2).forEach((apt, idx) => {
      activities.push({
        id: activities.length + 1,
        type: "appointment",
        action: "Appointment scheduled",
        customer: apt.customerName,
        amount: "",
        time: apt.date,
        icon: Calendar,
        color: "text-success",
        date: new Date(apt.date),
      });
    });

    // Sort by date (most recent first) and limit to 4
    return activities
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 4)
      .map((activity, idx) => {
        // Format time relative to now or as date
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - activity.date.getTime()) / (1000 * 60 * 60 * 24));
        let timeLabel = "";
        if (daysDiff === 0) {
          timeLabel = "Today";
        } else if (daysDiff === 1) {
          timeLabel = "Yesterday";
        } else if (daysDiff < 7) {
          timeLabel = `${daysDiff} days ago`;
        } else {
          timeLabel = formatDateForInput(activity.date);
        }

        return {
          ...activity,
          time: timeLabel,
        };
      });
  }, [filteredData]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const showWalkthrough = localStorage.getItem("showWalkthrough");
    
    if (!isAuthenticated) {
      navigate("/signin");
      return;
    } else if (showWalkthrough === "true") {
      navigate("/walkthrough");
      return;
    }
    setIsCheckingAuth(false);
  }, [navigate]);

  // Show loading state while checking authentication - EARLY RETURN AFTER ALL HOOKS
  if (isCheckingAuth) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Use filtered appointments
  const todaysAppointments = filteredData.appointments;

  const handleNewEstimatesClick = () => {
    navigate("/estimates", {
      state: {
        dateRange: {
          from: dateRange.from || todayStart,
          to: dateRange.to || todayEnd,
        },
      },
    });
  };

  const handleActiveJobsClick = () => {
    navigate("/jobs", {
      state: {
        dateFrom: dateRange.from || todayStart,
        dateTo: dateRange.to || todayEnd,
        timeFilter: "day",
      },
    });
  };

  const handleAwaitingPaymentsClick = () => {
    navigate("/invoices", {
      state: {
        filterUnpaid: true,
      },
    });
  };

  const handleTodaysAppointmentsClick = () => {
    navigate("/appointments/manage", {
      state: {
        selectedDate: formatDateForInput(today),
        calendarView: "day",
      },
    });
  };

  return (
    <div className="flex-1">
      <AppHeader title="Dashboard" />

      <main className={cn(
        "px-4 sm:px-6 space-y-6 animate-fade-in",
        isMobileOrTablet ? "pt-20 pb-6" : "py-4 sm:py-6"
      )}>
        {/* Date Range Filter - Only visible on tablet */}
        {isTablet && (
          <div className="flex justify-end mb-4">
            <DateRangeFilter
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              className="w-[200px]"
            />
          </div>
        )}

        {/* Four Primary Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="app-card p-4 card-shine cursor-pointer group" onClick={handleNewEstimatesClick}>
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-all shadow-sm">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <TrendingUp className="h-4 w-4 text-success animate-float" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">New Estimates</p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground font-display">{metricsData.newEstimates}</p>
              <p className="text-xs text-success font-medium">↑ 12% this week</p>
            </div>
          </div>

          <div className="app-card p-4 card-shine cursor-pointer group" onClick={handleActiveJobsClick}>
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 group-hover:from-accent/20 group-hover:to-accent/10 transition-all shadow-sm">
                <Briefcase className="h-5 w-5 text-accent" />
              </div>
              <TrendingUp className="h-4 w-4 text-success animate-float" style={{ animationDelay: '0.2s' }} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Active Jobs</p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground font-display">{metricsData.activeJobs}</p>
              <p className="text-xs text-accent font-medium">$795.00</p>
            </div>
          </div>

          <div className="app-card p-4 card-shine cursor-pointer group" onClick={handleAwaitingPaymentsClick}>
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-warning/10 to-warning/5 group-hover:from-warning/20 group-hover:to-warning/10 transition-all shadow-sm">
                <DollarSign className="h-5 w-5 text-warning" />
              </div>
              <AlertCircle className="h-4 w-4 text-warning animate-pulse" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Awaiting Payments</p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground font-display">{metricsData.awaitingPayments.count}</p>
              <p className="text-xs text-warning font-medium">${metricsData.awaitingPayments.amount}</p>
            </div>
          </div>

          <div className="app-card p-4 card-shine cursor-pointer group" onClick={handleTodaysAppointmentsClick}>
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-success/10 to-success/5 group-hover:from-success/20 group-hover:to-success/10 transition-all shadow-sm">
                <Calendar className="h-5 w-5 text-success" />
              </div>
              <CheckCircle className="h-4 w-4 text-success animate-float" style={{ animationDelay: '0.4s' }} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Today's Appointments</p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground font-display">{metricsData.todaysAppointments}</p>
              <p className="text-xs text-success font-medium">On schedule</p>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
          <div className="app-card overflow-hidden">
          <CardHeader className="p-4 sm:p-5 border-b">
            <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-5">
            {/* First 3 items in horizontal card layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {recentActivity.slice(0, 3).map((activity) => {
                const Icon = activity.icon;
                return (
                  <Card
                    key={activity.id}
                    className="p-4 hover:shadow-md transition-all cursor-pointer group border hover:border-primary/30"
                    onClick={() => {
                      if (activity.type === "estimate") navigate("/estimates");
                      else if (activity.type === "invoice") navigate("/invoices");
                      else if (activity.type === "job") navigate("/jobs");
                      else if (activity.type === "appointment") navigate("/appointments/manage");
                    }}
                  >
                    <div className="flex items-start gap-3 h-full">
                      {/* Icon on the left */}
                      <div className={`p-2.5 rounded-lg bg-muted flex-shrink-0 ${activity.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      
                      {/* Content area: Title, subtitle, amount, timestamp */}
                      <div className="flex-1 min-w-0 flex flex-col h-full">
                        {/* Title and subtitle stacked */}
                        <div className="flex-1 mb-3">
                          <p className="text-sm font-semibold text-foreground mb-1 leading-tight">{activity.action}</p>
                          <p className="text-xs text-muted-foreground leading-tight">{activity.customer}</p>
                        </div>
                        
                        {/* Amount and timestamp row at bottom */}
                        <div className="flex items-center justify-between pt-3 border-t">
                          {/* Amount aligned right */}
                          <div className="flex-1"></div>
                          {activity.amount && (
                            <span className="text-sm font-bold text-foreground mr-4">{activity.amount}</span>
                          )}
                          {/* Timestamp on far right */}
                          <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Remaining items (if any) displayed normally */}
            {recentActivity.length > 3 && (
              <div className="space-y-3 pt-4 border-t">
                {recentActivity.slice(3).map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div
                      key={activity.id}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all cursor-pointer group"
                      onClick={() => {
                        if (activity.type === "estimate") navigate("/estimates");
                        else if (activity.type === "invoice") navigate("/invoices");
                        else if (activity.type === "job") navigate("/jobs");
                        else if (activity.type === "appointment") navigate("/appointments/manage");
                      }}
                    >
                      <div className={`p-2 rounded-lg bg-muted ${activity.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{activity.action}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{activity.customer}</span>
                          {activity.amount && (
                            <>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs font-semibold text-foreground">{activity.amount}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
              </div>
              
        {/* Quick Actions Section */}
        <div className="app-card overflow-hidden">
          <CardHeader className="p-4 sm:p-5 border-b">
            <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <Button
                variant="outline"
                className="h-auto flex-col gap-2 py-4 px-3 hover:border-primary hover:bg-primary/5 transition-all touch-target cursor-pointer"
                onClick={() => navigate("/estimates/new")}
                aria-label="Create new estimate"
              >
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-center">New Estimate</span>
              </Button>

              <Button
                variant="outline"
                className="h-auto flex-col gap-2 py-4 px-3 hover:border-success hover:bg-success/5 transition-all touch-target cursor-pointer"
                onClick={() => navigate("/invoices/new")}
                aria-label="Create new invoice"
              >
                <div className="p-2 rounded-lg bg-success/10 text-success">
                  <DollarSign className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-center">New Invoice</span>
              </Button>

              <Button
                variant="outline"
                className="h-auto flex-col gap-2 py-4 px-3 hover:border-accent hover:bg-accent/5 transition-all touch-target cursor-pointer"
                onClick={() => navigate("/agreements/new")}
                aria-label="Create new agreement"
              >
                <div className="p-2 rounded-lg bg-accent/10 text-accent">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-center">New Agreement</span>
                </Button>

              <Button
                variant="outline"
                className="h-auto flex-col gap-2 py-4 px-3 hover:border-warning hover:bg-warning/5 transition-all touch-target cursor-pointer"
                onClick={() => navigate("/employees/job-route")}
                aria-label="View job route"
              >
                <div className="p-2 rounded-lg bg-warning/10 text-warning">
                  <MapPinned className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-center">Job Route</span>
              </Button>
            </div>
          </CardContent>
        </div>

        {/* Others Section */}
          <div className="app-card overflow-hidden">
          <CardHeader className="p-4 sm:p-5 border-b">
            <CardTitle className="text-lg font-bold">Others</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              <button
                onClick={() => navigate("/customers")}
                className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group touch-target"
              >
                <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-center">Customers</span>
              </button>

              <button
                onClick={() => navigate("/jobs")}
                className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-border hover:border-accent hover:bg-accent/5 transition-all cursor-pointer group touch-target"
              >
                <div className="p-3 rounded-lg bg-accent/10 text-accent group-hover:scale-110 transition-transform">
                  <Briefcase className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-center">Jobs</span>
              </button>

              <button
                onClick={() => navigate("/appointments/manage")}
                className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-border hover:border-success hover:bg-success/5 transition-all cursor-pointer group touch-target"
              >
                <div className="p-3 rounded-lg bg-success/10 text-success group-hover:scale-110 transition-transform">
                  <Calendar className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-center">Appointments</span>
              </button>

              <button
                onClick={() => navigate("/employees")}
                className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-border hover:border-blue-500 hover:bg-blue-500/5 transition-all cursor-pointer group touch-target"
              >
                <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
                  <UserCheck className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-center">Employees</span>
              </button>

              <button
                onClick={() => navigate("/inventory")}
                className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-border hover:border-orange-500 hover:bg-orange-500/5 transition-all cursor-pointer group touch-target"
              >
                <div className="p-3 rounded-lg bg-orange-500/10 text-orange-500 group-hover:scale-110 transition-transform">
                  <Package className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-center">Inventory</span>
              </button>

              <button
                onClick={() => navigate("/reports")}
                className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-border hover:border-indigo-500 hover:bg-indigo-500/5 transition-all cursor-pointer group touch-target"
              >
                <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-500 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-center">Reports</span>
              </button>
            </div>
          </CardContent>
        </div>

        {/* Today's Appointments Section */}
        <div className="app-card overflow-hidden">
          <CardHeader className="p-4 sm:p-5 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold">
                {isTablet && dateRange.from && dateRange.to && 
                 (dateRange.from.getTime() !== todayStart.getTime() || dateRange.to.getTime() !== todayEnd.getTime())
                  ? "Appointments" 
                  : "Today's Appointments"}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/appointments/manage", {
                  state: {
                    selectedDate: dateRange.from ? formatDateForInput(dateRange.from) : formatDateForInput(today),
                    calendarView: "day",
                  },
                })}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-5">
            {todaysAppointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {todaysAppointments.slice(0, 3).map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/50 transition-all cursor-pointer group"
                    onClick={() => navigate("/appointments/manage", {
                      state: {
                        selectedDate: dateRange.from ? formatDateForInput(dateRange.from) : formatDateForInput(today),
                        calendarView: "day",
                      },
                    })}
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-bold text-primary text-sm">
                        {apt.customerName.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate text-sm">{apt.customerName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">{apt.subject}</Badge>
                        <span className="text-xs text-muted-foreground">{apt.startTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No appointments scheduled for today.
              </p>
            )}
          </CardContent>
        </div>
      </main>
    </div>
  );
};

export default Index;
