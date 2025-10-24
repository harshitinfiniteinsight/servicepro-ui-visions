import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { EmployeeFormModal } from "@/components/modals/EmployeeFormModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Mail, Phone, Briefcase, Calendar, Eye } from "lucide-react";
import { mockEmployees } from "@/data/mockData";

const Employees = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const filteredEmployees = mockEmployees.filter((employee) =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1">
      <AppHeader searchPlaceholder="Search employees..." onSearchChange={setSearchQuery} />

      <main className="px-6 py-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Employees</h1>
            <p className="text-muted-foreground">Manage your team members</p>
          </div>
          <Button onClick={() => setModalOpen(true)} className="gap-2">
            <Plus className="h-5 w-5" />
            Add Employee
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((employee) => {
            const initials = employee.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase();

            return (
              <Card key={employee.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="h-16 w-16 border-2 border-primary/20 shadow-md">
                      <AvatarImage src={employee.avatar} alt={employee.name} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-white font-semibold text-lg">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-foreground">{employee.name}</h3>
                      <p className="text-sm text-muted-foreground">{employee.id}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="border-primary/30 text-primary">{employee.role}</Badge>
                        <Badge className="bg-success/10 text-success border-success/20" variant="outline">{employee.status}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-3 text-sm bg-muted/30 p-2 rounded-lg">
                      <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-foreground truncate">{employee.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm bg-muted/30 p-2 rounded-lg">
                      <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-foreground">{employee.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm bg-muted/30 p-2 rounded-lg">
                      <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-foreground">
                        Hired {new Date(employee.hireDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4 mb-4">
                    <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        Total Jobs
                      </span>
                      <span className="font-bold text-xl text-primary">{employee.totalJobs}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-2">
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                    <Button size="sm" className="flex-1">
                      Assign Job
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <EmployeeFormModal open={modalOpen} onOpenChange={setModalOpen} mode="create" />
      </main>
    </div>
  );
};

export default Employees;
