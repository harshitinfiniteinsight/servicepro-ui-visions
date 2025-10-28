import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, SlidersHorizontal, Calendar as CalendarIcon, List, ChevronLeft, ChevronRight } from "lucide-react";
import { mockAgreements, mockEstimates, mockInvoices, mockEmployees } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ViewMode = "list" | "calendar";
type TimeFilter = "day" | "week" | "month";
type JobType = "agreement" | "estimate" | "invoice";

interface JobItem {
  id: string;
  orderId: string;
  type: JobType;
  date: string;
  employeeName: string;
  customerName: string;
  amount: number;
}

const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("day");
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Transform data into unified format
  const allJobs: JobItem[] = [
    ...mockAgreements.map((agreement) => ({
      id: agreement.id,
      orderId: agreement.id.replace("AGR-", "G"),
      type: "agreement" as JobType,
      date: agreement.startDate,
      employeeName: "N/A",
      customerName: agreement.customerName,
      amount: agreement.amount,
    })),
    ...mockEstimates.map((estimate) => ({
      id: estimate.id,
      orderId: estimate.id.replace("EST-", ""),
      type: "estimate" as JobType,
      date: estimate.createdDate,
      employeeName: estimate.employeeName,
      customerName: estimate.customerName,
      amount: estimate.amount,
    })),
    ...mockInvoices.map((invoice) => ({
      id: invoice.id,
      orderId: invoice.orderId,
      type: "invoice" as JobType,
      date: invoice.issueDate,
      employeeName: invoice.employeeName,
      customerName: invoice.customerName,
      amount: invoice.amount,
    })),
  ];

  // Filter and sort jobs
  const filteredJobs = allJobs
    .filter((job) => {
      const matchesSearch =
        job.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.employeeName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesEmployee = selectedEmployee === "all" || job.employeeName === selectedEmployee;
      
      const jobDate = new Date(job.date);
      const matchesDateFrom = !dateFrom || jobDate >= dateFrom;
      const matchesDateTo = !dateTo || jobDate <= dateTo;
      
      return matchesSearch && matchesEmployee && matchesDateFrom && matchesDateTo;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Group jobs by date
  const groupedJobs = filteredJobs.reduce((acc, job) => {
    const date = new Date(job.date).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(job);
    return acc;
  }, {} as Record<string, JobItem[]>);

  const getJobColor = (type: JobType) => {
    switch (type) {
      case "agreement":
        return "border-l-blue-500";
      case "invoice":
        return "border-l-orange-500";
      case "estimate":
        return "border-l-green-500";
    }
  };

  const getJobLabel = (type: JobType) => {
    switch (type) {
      case "agreement":
        return { label: "Agreement Amount", color: "text-blue-600" };
      case "invoice":
        return { label: "Invoice Amount", color: "text-orange-600" };
      case "estimate":
        return { label: "Estimate Amount", color: "text-green-600" };
    }
  };

  // Calendar helpers
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const firstDayOfMonth = monthStart.getDay();
  const calendarDays = Array.from({ length: firstDayOfMonth }, () => null).concat(daysInMonth);
  
  const getJobsForDate = (date: Date) => {
    return filteredJobs.filter((job) => isSameDay(new Date(job.date), date));
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  return (
    <div className="flex-1">
      <AppHeader searchPlaceholder="Search jobs..." onSearchChange={setSearchQuery} />

      <main className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Job Dashboard</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              View all agreements, estimates, and invoices
            </p>
          </div>
        </div>

        {/* Filters and View Controls */}
        <div className="flex flex-col gap-4">
          {/* Date Range and Employee Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="text-sm text-muted-foreground mb-1.5 block">From Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex-1">
              <label className="text-sm text-muted-foreground mb-1.5 block">To Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateTo} onSelect={setDateTo} />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex-1">
              <label className="text-sm text-muted-foreground mb-1.5 block">Employee</label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue placeholder="All Employees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  {mockEmployees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.name}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Time Filter and View Mode Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Time Filter Buttons */}
            <div className="flex gap-2">
              <Button
                variant={timeFilter === "day" ? "default" : "outline"}
                onClick={() => setTimeFilter("day")}
                className={cn(
                  "flex-1 sm:flex-none",
                  timeFilter === "day" && "bg-cyan-500 hover:bg-cyan-600 text-white"
                )}
              >
                Day
              </Button>
              <Button
                variant={timeFilter === "week" ? "default" : "outline"}
                onClick={() => setTimeFilter("week")}
                className={cn(
                  "flex-1 sm:flex-none",
                  timeFilter === "week" && "bg-cyan-500 hover:bg-cyan-600 text-white"
                )}
              >
                Week
              </Button>
              <Button
                variant={timeFilter === "month" ? "default" : "outline"}
                onClick={() => setTimeFilter("month")}
                className={cn(
                  "flex-1 sm:flex-none",
                  timeFilter === "month" && "bg-cyan-500 hover:bg-cyan-600 text-white"
                )}
              >
                Month
              </Button>
            </div>

            {/* View Mode Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 sm:flex-none gap-2 bg-orange-500 hover:bg-orange-600 text-white border-0"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Apply Filter
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                onClick={() => setViewMode("list")}
                className={cn(
                  "flex-1 sm:flex-none",
                  viewMode === "list" && "bg-cyan-500 hover:bg-cyan-600 text-white"
                )}
              >
                <List className="h-5 w-5" />
              </Button>
              <Button
                variant={viewMode === "calendar" ? "default" : "outline"}
                onClick={() => setViewMode("calendar")}
                className={cn(
                  "flex-1 sm:flex-none",
                  viewMode === "calendar" && "bg-cyan-500 hover:bg-cyan-600 text-white"
                )}
              >
                <CalendarIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        {viewMode === "list" && (
          <div className="space-y-6">
            {Object.entries(groupedJobs).map(([date, jobs]) => (
              <div key={date} className="space-y-3">
                {/* Date Header */}
                <div className="inline-block bg-cyan-500 text-white px-6 py-2 rounded-full font-semibold">
                  {date}
                </div>

                {/* Jobs for this date */}
                <div className="space-y-3">
                  {jobs.map((job) => {
                    const jobInfo = getJobLabel(job.type);
                    return (
                      <Card
                        key={job.id}
                        className={cn(
                          "border-0 shadow-md border-l-4 transition-all hover:shadow-lg",
                          getJobColor(job.type)
                        )}
                      >
                        <div className="p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                            {/* Left side - Job Details */}
                            <div className="flex-1 space-y-3 min-w-0">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-muted-foreground">Order Id</span>
                                  <Eye className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" />
                                </div>
                              </div>
                              <p className="text-lg sm:text-xl font-semibold text-cyan-600 break-all">
                                {job.orderId}
                              </p>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Employee Name</span>
                                  <p className="font-medium text-foreground truncate">{job.employeeName}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Customer Name</span>
                                  <p className="font-medium text-foreground truncate underline cursor-pointer">
                                    {job.customerName}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Right side - Amount */}
                            <div className="flex flex-col items-end gap-1 min-w-fit">
                              <span className={cn("text-sm font-medium", jobInfo.color)}>
                                {jobInfo.label}
                              </span>
                              <p className="text-3xl sm:text-4xl font-bold text-foreground">
                                ${job.amount.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}

            {Object.keys(groupedJobs).length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No jobs found matching your search
              </div>
            )}
          </div>
        )}

        {/* Calendar View */}
        {viewMode === "calendar" && (
          <div className="bg-card rounded-lg shadow-md p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateMonth('prev')}
                className="hover:bg-muted"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-xl font-semibold text-cyan-500">
                {format(currentMonth, "MMMM, yyyy")}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateMonth('next')}
                className="hover:bg-muted"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Day Headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}

              {/* Calendar Days */}
              {calendarDays.map((day, index) => {
                if (!day) {
                  return <div key={`empty-${index}`} className="aspect-square" />;
                }

                const dayJobs = getJobsForDate(day);
                const isToday = isSameDay(day, new Date());
                const isCurrentMonth = isSameMonth(day, currentMonth);

                return (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      "aspect-square border rounded-lg p-2 relative",
                      isCurrentMonth ? "bg-background" : "bg-muted/20",
                      isToday && "bg-cyan-500 text-white font-bold"
                    )}
                  >
                    <div className="text-sm sm:text-base text-center mb-1">
                      {format(day, "d")}
                    </div>
                    {dayJobs.length > 0 && (
                      <div className="absolute bottom-1 left-1 right-1 flex gap-0.5 justify-center flex-wrap">
                        {dayJobs.slice(0, 3).map((job) => (
                          <div
                            key={job.id}
                            className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              job.type === "agreement" && "bg-blue-500",
                              job.type === "invoice" && "bg-orange-500",
                              job.type === "estimate" && "bg-green-500"
                            )}
                          />
                        ))}
                        {dayJobs.length > 3 && (
                          <div className="text-[8px] text-muted-foreground">+{dayJobs.length - 3}</div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Jobs;
