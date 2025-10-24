import { useState } from "react";
import { Logo } from "@/components/Logo";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Bell, Plus, Calendar, MapPin, User } from "lucide-react";
import { mockJobs } from "@/data/mockData";

const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState("");

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
    <div className="flex flex-col md:flex-row min-h-screen bg-muted/30">
      <Navigation />
      
      <div className="flex-1 pb-20 md:pb-6">
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
                placeholder="Search jobs..." 
                className="pl-11 h-12 bg-background border-border"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </header>

        <main className="px-4 md:px-8 py-6 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Jobs</h1>
              <p className="text-muted-foreground">Track and manage all service jobs</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-5 w-5" />
              New Job
            </Button>
          </div>

          <div className="grid gap-4">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="card-hover border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg text-foreground">{job.title}</h3>
                            <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                            <Badge className={getPriorityColor(job.priority)} variant="outline">
                              {job.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{job.id} • {job.customerName}</p>
                          <p className="text-sm text-foreground">{job.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">${job.amount}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(job.scheduledDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>{job.assignedTo}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span className="line-clamp-1">{job.address}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">View Details</Button>
                      <Button size="sm">Update Status</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Jobs;
