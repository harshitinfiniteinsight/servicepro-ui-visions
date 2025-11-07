import { useParams, useNavigate } from "react-router-dom";
import MobileHeader from "@/components/layout/MobileHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockEmployees, mockJobs } from "@/data/mobileMockData";
import { Phone, Mail, Calendar, Star, Briefcase, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { statusColors } from "@/data/mobileMockData";

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const employee = mockEmployees.find(e => e.id === id);
  
  if (!employee) {
    return (
      <div className="h-full flex items-center justify-center">
        <p>Employee not found</p>
      </div>
    );
  }

  const initials = employee.name.split(" ").map(n => n[0]).join("");
  const employeeJobs = mockJobs.filter(j => j.technicianId === id);
  const upcomingJobs = employeeJobs.filter(j => new Date(j.date) >= new Date()).slice(0, 5);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <MobileHeader title="Employee Details" showBack={true} />
      
      <div className="flex-1 overflow-y-auto scrollable pt-14">
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-primary/10 to-accent/5">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-3xl font-bold text-primary">{initials}</span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{employee.name}</h2>
              <Badge className={cn("mb-2", statusColors[employee.status])}>
                {employee.status}
              </Badge>
              <p className="text-sm text-muted-foreground">{employee.role}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 px-4 py-4">
          <Button variant="outline" className="gap-2" onClick={() => window.location.href = `tel:${employee.phone}`}>
            <Phone className="h-4 w-4" />
            Call
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => window.location.href = `mailto:${employee.email}`}>
            <Mail className="h-4 w-4" />
            Email
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 px-4 mb-4">
          <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-center">
            <p className="text-xs text-muted-foreground mb-1">Rating</p>
            <div className="flex items-center justify-center gap-1">
              <Star className="h-4 w-4 fill-warning text-warning" />
              <p className="text-lg font-bold">{employee.rating}</p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-success/5 border border-success/20 text-center">
            <p className="text-xs text-muted-foreground mb-1">Total Jobs</p>
            <p className="text-lg font-bold">{employeeJobs.length}</p>
          </div>
          <div className="p-3 rounded-xl bg-warning/5 border border-warning/20 text-center">
            <p className="text-xs text-muted-foreground mb-1">Upcoming</p>
            <p className="text-lg font-bold">{upcomingJobs.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="info" className="px-4">
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4 pb-6">
            <div className="p-4 rounded-xl border bg-card">
              <h3 className="font-semibold mb-3">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{employee.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{employee.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Hired: {new Date(employee.hireDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border bg-card">
              <h3 className="font-semibold mb-3">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {employee.specialties.map(spec => (
                  <Badge key={spec} variant="outline">{spec}</Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-3 pb-6">
            {upcomingJobs.length > 0 ? (
              upcomingJobs.map(job => (
                <div key={job.id} className="p-4 rounded-xl border bg-card">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold">{job.title}</h4>
                      <p className="text-sm text-muted-foreground">{job.customerName}</p>
                    </div>
                    <Badge className={cn("text-xs", statusColors[job.status])}>{job.status}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(job.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{job.time}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No upcoming jobs</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EmployeeDetails;

