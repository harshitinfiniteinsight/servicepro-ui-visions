import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Calendar as CalendarIcon, List, Edit } from "lucide-react";
import { mockEmployees } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

const ManageAppointments = () => {
  const navigate = useNavigate();
  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [calendarView, setCalendarView] = useState<"month" | "week" | "day">("month");

  const mockAppointments = [
    {
      id: "APT-001",
      customerName: "Sarah Johnson",
      subject: "HVAC Maintenance Check",
      date: "2025-10-25",
      time: "10:00 AM",
      employee: "John Doe",
    },
    {
      id: "APT-002",
      customerName: "Mike Williams",
      subject: "Plumbing Consultation",
      date: "2025-10-26",
      time: "2:00 PM",
      employee: "Jane Smith",
    },
  ];

  return (
    <div className="flex-1">
      <AppHeader searchPlaceholder="Search appointments..." />

      <main className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Manage Appointments</h1>
            <p className="text-sm sm:text-base text-muted-foreground">View and manage all appointments</p>
          </div>
          <Button 
            onClick={() => navigate("/appointments/add")} 
            className="gap-2 w-full sm:w-auto shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="h-4 w-4" />
            <span className="text-sm">Add Appointment</span>
          </Button>
        </div>

        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-muted">
            <TabsTrigger value="calendar" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm py-2.5">
              <CalendarIcon className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Calendar View</span>
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm py-2.5">
              <List className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Appointment List</span>
            </TabsTrigger>
          </TabsList>

          {/* Calendar View Tab */}
          <TabsContent value="calendar" className="space-y-4 mt-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Select Employee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  {mockEmployees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button
                  variant={calendarView === "month" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCalendarView("month")}
                  className="flex-1 sm:flex-initial"
                >
                  Month
                </Button>
                <Button
                  variant={calendarView === "week" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCalendarView("week")}
                  className="flex-1 sm:flex-initial"
                >
                  Week
                </Button>
                <Button
                  variant={calendarView === "day" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCalendarView("day")}
                  className="flex-1 sm:flex-initial"
                >
                  Day
                </Button>
              </div>
            </div>

            {/* Calendar Views */}
            {calendarView === "month" && (
              <Card className="border border-border bg-card shadow-md">
                <CardContent className="p-4">
                  <div className="grid grid-cols-7 gap-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="text-center text-xs font-semibold text-muted-foreground p-2">
                        {day}
                      </div>
                    ))}
                    {Array.from({ length: 35 }, (_, i) => {
                      const date = new Date();
                      date.setDate(date.getDate() - date.getDay() + i);
                      const dayAppointments = mockAppointments.filter(apt => apt.date === date.toISOString().split('T')[0]);
                      
                      return (
                        <div
                          key={i}
                          className="min-h-24 p-2 rounded-lg border border-border bg-card hover:shadow-md transition-all cursor-pointer"
                        >
                          <div className="text-xs font-semibold mb-1 text-foreground">{date.getDate()}</div>
                          {dayAppointments.slice(0, 2).map((apt) => (
                            <div key={apt.id} className="text-xs p-1 mb-1 bg-primary/10 rounded border border-primary/20 truncate">
                              {apt.time}
                            </div>
                          ))}
                          {dayAppointments.length > 2 && (
                            <div className="text-xs text-muted-foreground">+{dayAppointments.length - 2}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {calendarView === "week" && (
              <Card className="border border-border bg-card shadow-md">
                <CardContent className="p-4">
                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {Array.from({ length: 7 }, (_, dayIndex) => {
                      const date = new Date();
                      date.setDate(date.getDate() - date.getDay() + dayIndex);
                      
                      return (
                        <div key={dayIndex} className="border border-border rounded-lg p-3">
                          <h3 className="font-semibold text-foreground mb-3">
                            {date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                          </h3>
                          <div className="space-y-2">
                            {Array.from({ length: 24 }, (_, hour) => {
                              const hourAppointments = mockAppointments.filter(apt => {
                                const aptDate = new Date(apt.date);
                                return aptDate.toDateString() === date.toDateString() && 
                                       parseInt(apt.time) === hour;
                              });
                              
                              return (
                                <div key={hour} className="flex gap-3 p-2 bg-muted/20 rounded-md">
                                  <div className="w-20 text-sm font-medium text-muted-foreground">
                                    {hour.toString().padStart(2, '0')}:00
                                  </div>
                                  <div className="flex-1">
                                    {hourAppointments.map((apt) => (
                                      <div key={apt.id} className="p-2 bg-primary/10 rounded border border-primary/20 mb-1">
                                        <p className="text-sm font-semibold">{apt.subject}</p>
                                        <p className="text-xs text-muted-foreground">{apt.customerName}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {calendarView === "day" && (
              <Card className="border border-border bg-card shadow-md">
                <CardContent className="p-4">
                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {Array.from({ length: 24 }, (_, hour) => {
                      const hourAppointments = mockAppointments.filter(apt => 
                        parseInt(apt.time) === hour
                      );
                      
                      return (
                        <div key={hour} className="flex gap-3 p-3 bg-muted/20 rounded-lg border border-border hover:shadow-md transition-all">
                          <div className="w-24 text-base font-semibold text-foreground">
                            {hour.toString().padStart(2, '0')}:00
                          </div>
                          <div className="flex-1 space-y-2">
                            {hourAppointments.length > 0 ? (
                              hourAppointments.map((apt) => (
                                <div key={apt.id} className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                                  <p className="font-semibold text-foreground">{apt.subject}</p>
                                  <p className="text-sm text-muted-foreground">{apt.customerName}</p>
                                  <p className="text-xs text-muted-foreground mt-1">Employee: {apt.employee}</p>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-muted-foreground italic">No appointments</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Appointment List Tab */}
          <TabsContent value="list" className="space-y-4 mt-6">
            <Card className="border border-border bg-card shadow-md">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {mockAppointments.map((apt) => (
                    <div key={apt.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gradient-to-r from-muted/30 to-muted/10 rounded-lg border border-border hover:shadow-md transition-all">
                      <div className="flex-1 space-y-1 mb-3 sm:mb-0">
                        <h3 className="font-bold text-foreground">{apt.subject}</h3>
                        <p className="text-sm text-muted-foreground">Customer: {apt.customerName}</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded-md border border-accent/20">
                            {apt.date}
                          </span>
                          <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md border border-primary/20">
                            {apt.time}
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="gap-2 w-full sm:w-auto">
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ManageAppointments;
