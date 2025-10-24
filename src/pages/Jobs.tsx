import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { JobFormModal } from "@/components/modals/JobFormModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Bell, Plus, Calendar, MapPin, User } from "lucide-react";
import { mockJobs } from "@/data/mockData";

const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const filteredJobs = mockJobs.filter((job) =>
    job.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-success/10 text-success";
      case "In Progress":
        return "bg-warning/10 text-warning";
      case "Scheduled":
        return "bg-info/10 text-info";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive/10 text-destructive";
      case "medium":
        return "bg-warning/10 text-warning";
      case "low":
        return "bg-success/10 text-success";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="flex-1">
      <AppHeader searchPlaceholder="Search jobs..." onSearchChange={setSearchQuery} />

      <main className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Jobs</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Track and manage all service jobs</p>
            </div>
            <Button onClick={() => setModalOpen(true)} className="gap-2 w-full sm:w-auto">
              <Plus className="h-5 w-5" />
              New Job
            </Button>
          </div>

          <div className="grid gap-4">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="card-hover border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <h3 className="font-semibold text-base sm:text-lg text-foreground">{job.title}</h3>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                            <Badge className={getPriorityColor(job.priority)} variant="outline">
                              {job.priority}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{job.id} • {job.customerName}</p>
                        <p className="text-sm text-foreground line-clamp-2">{job.description}</p>
                      </div>
                      <div className="flex sm:flex-col items-start sm:items-end gap-2">
                        <p className="text-xl sm:text-2xl font-bold text-primary whitespace-nowrap">${job.amount}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4 flex-shrink-0" />
                        <span>{new Date(job.scheduledDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4 flex-shrink-0" />
                        <span>{job.assignedTo}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="line-clamp-1">{job.address}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t">
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">View Details</Button>
                      <Button size="sm" className="w-full sm:w-auto">Update Status</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <JobFormModal open={modalOpen} onOpenChange={setModalOpen} mode="create" />
        </main>
    </div>
  );
};

export default Jobs;
