import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
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
  Clock
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

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Estimates Card */}
          <Card className="border-0 shadow-md border-t-4 border-t-blue-500">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold">Estimates</CardTitle>
                <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50" onClick={() => navigate("/estimates")}>
                  <Plus className="h-4 w-4 mr-1" />
                  New Estimate
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">New</span>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold">{estimatesData.new}</span>
                    <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                      Schedule Assessments
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2 border-t">
                  <span className="text-muted-foreground">Approved</span>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-2xl font-bold">{estimatesData.approved.count}</div>
                      <div className="text-sm text-muted-foreground">${estimatesData.approved.amount.toLocaleString()}</div>
                    </div>
                    <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                      Convert to Jobs
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2 border-t">
                  <span className="text-muted-foreground">Changes requested</span>
                  <span className="text-2xl font-bold">{estimatesData.changesRequested}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-t">
                  <span className="text-muted-foreground">Draft</span>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-2xl font-bold">{estimatesData.draft.count}</div>
                      <div className="text-sm text-muted-foreground">${estimatesData.draft.amount.toLocaleString()}</div>
                    </div>
                    <Button size="sm" variant="link" className="text-green-600">
                      View
                    </Button>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground mb-2">Last 7 Days</p>
                <div className="h-12 flex items-end gap-1">
                  {[20, 35, 45, 30, 50, 40, 55].map((height, i) => (
                    <div key={i} className="flex-1 bg-blue-500 rounded-t" style={{ height: `${height}%` }} />
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-blue-700" />
                    <span className="text-muted-foreground">Sent</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-blue-300" />
                    <span className="text-muted-foreground">Converted</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Jobs Card */}
          <Card className="border-0 shadow-md border-t-4 border-t-yellow-500">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold">Jobs</CardTitle>
                <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50" onClick={() => navigate("/jobs")}>
                  <Plus className="h-4 w-4 mr-1" />
                  New Job
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">Requires invoicing</span>
                  <span className="text-2xl font-bold">{jobsData.requiresInvoicing}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-t">
                  <span className="text-muted-foreground">Action required</span>
                  <span className="text-2xl font-bold">{jobsData.actionRequired}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-t">
                  <span className="text-muted-foreground">Active</span>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-2xl font-bold">{jobsData.active.count}</div>
                      <div className="text-sm text-muted-foreground">${jobsData.active.amount.toLocaleString()}</div>
                    </div>
                    <Button size="sm" variant="link" className="text-green-600">
                      View
                    </Button>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground mb-2">Last 7 Days</p>
                <div className="h-12 flex items-end gap-1">
                  {[40, 55, 35, 60, 45, 70, 50].map((height, i) => (
                    <div key={i} className="flex-1 bg-yellow-500 rounded-t" style={{ height: `${height}%` }} />
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-yellow-700" />
                    <span className="text-muted-foreground">Started</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-yellow-300" />
                    <span className="text-muted-foreground">Completed</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoices Card */}
          <Card className="border-0 shadow-md border-t-4 border-t-purple-500">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold">Invoices</CardTitle>
                <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50" onClick={() => navigate("/invoices")}>
                  <Plus className="h-4 w-4 mr-1" />
                  New Invoice
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">Past Due</span>
                  <span className="text-2xl font-bold">{invoicesData.pastDue}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-t">
                  <span className="text-muted-foreground">Awaiting payment</span>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-2xl font-bold">{invoicesData.awaitingPayment.count}</div>
                      <div className="text-sm text-muted-foreground">${invoicesData.awaitingPayment.amount.toLocaleString()}</div>
                    </div>
                    <Button size="sm" variant="link" className="text-green-600">
                      View
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2 border-t">
                  <span className="text-muted-foreground">Draft</span>
                  <span className="text-2xl font-bold">{invoicesData.draft}</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground mb-2">Last 30 Days</p>
                <div className="h-12 flex items-end gap-1">
                  {[30, 40, 35, 50, 45, 60, 70].map((height, i) => (
                    <div key={i} className="flex-1 bg-purple-500 rounded-t" style={{ height: `${height}%` }} />
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-purple-700" />
                    <span className="text-muted-foreground">Sent</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-purple-300" />
                    <span className="text-muted-foreground">Paid</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appointments Summary Card */}
          <Card className="border-0 shadow-md border-t-4 border-t-green-500">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold">Appointments</CardTitle>
                <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50" onClick={() => navigate("/appointments/add")}>
                  <Plus className="h-4 w-4 mr-1" />
                  New Appointment
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-900 text-white p-4 rounded-lg">
                  <div className="text-3xl font-bold">{appointmentsData.total.count}</div>
                  <div className="text-sm mt-1">Total</div>
                  <div className="text-sm mt-2">${appointmentsData.total.amount.toFixed(2)}</div>
                </div>
                <div className="bg-gray-700 text-white p-4 rounded-lg">
                  <div className="text-3xl font-bold">{appointmentsData.toGo.count}</div>
                  <div className="text-sm mt-1">To Go</div>
                  <div className="text-sm mt-2">${appointmentsData.toGo.amount.toFixed(2)}</div>
                </div>
                <div className="bg-blue-500 text-white p-4 rounded-lg">
                  <div className="text-3xl font-bold">{appointmentsData.active.count}</div>
                  <div className="text-sm mt-1">Active</div>
                  <div className="text-sm mt-2">${appointmentsData.active.amount.toFixed(2)}</div>
                </div>
                <div className="bg-green-600 text-white p-4 rounded-lg">
                  <div className="text-3xl font-bold">{appointmentsData.complete.count}</div>
                  <div className="text-sm mt-1">Complete</div>
                  <div className="text-sm mt-2">${appointmentsData.complete.amount.toFixed(2)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section - Today's Appointments and Payments */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Today's Appointments */}
          <Card className="lg:col-span-2 border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Today's Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todaysAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                    <Avatar className="h-10 w-10 bg-gray-500">
                      <AvatarFallback className="bg-gray-500 text-white">
                        {appointment.customer.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span className="font-mono">{appointment.time}</span>
                      </div>
                      <div>
                        <Badge variant="outline" className="text-xs mb-1">
                          {appointment.type}
                        </Badge>
                        <div className="font-medium">{appointment.customer}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payments */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Payments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-2">ON ITS WAY TO YOUR BANK</p>
                <p className="text-xs text-muted-foreground mb-2">Expected on Oct 06, 2023</p>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">$320.33</div>
                  <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                    View Reports
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground font-medium mb-2">AVAILABLE FOR INSTANT PAYOUT</p>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">$1,337.00</div>
                  <Button size="sm" className="bg-gray-800 hover:bg-gray-700">
                    Get it now
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground font-medium">DISPUTES</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
