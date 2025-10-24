import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { EmployeeCard } from "@/components/EmployeeCard";
import { DeactivatedEmployeeCard } from "@/components/DeactivatedEmployeeCard";
import { EmployeeFormModal } from "@/components/modals/EmployeeFormModal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { mockEmployees } from "@/data/mockData";
import { toast } from "sonner";

const Employees = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("active");

  const filteredEmployees = mockEmployees.filter((employee) =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeEmployees = filteredEmployees.filter((e) => e.status === "Active");
  const deactivatedEmployees = filteredEmployees.filter((e) => e.status === "Deactivated");

  const handleEdit = (employeeId: string, employeeName: string) => {
    toast.info(`Edit ${employeeName}`);
  };

  const handleDeactivate = (employeeId: string, employeeName: string) => {
    toast.success(`${employeeName} has been deactivated`);
  };

  const handleActivate = (employeeId: string, employeeName: string) => {
    toast.success(`${employeeName} has been activated`);
  };

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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="active">Active Employees</TabsTrigger>
            <TabsTrigger value="deactivated">Deactivated Employees</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeEmployees.map((employee) => (
                <EmployeeCard
                  key={employee.id}
                  id={employee.id}
                  name={employee.name}
                  email={employee.email}
                  phone={employee.phone}
                  role={employee.role}
                  status={employee.status}
                  hireDate={employee.hireDate}
                  totalJobs={employee.totalJobs}
                  avatar={employee.avatar}
                  onEdit={() => handleEdit(employee.id, employee.name)}
                  onDeactivate={() => handleDeactivate(employee.id, employee.name)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="deactivated" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deactivatedEmployees.length > 0 ? (
                deactivatedEmployees.map((employee) => (
                  <DeactivatedEmployeeCard
                    key={employee.id}
                    id={employee.id}
                    name={employee.name}
                    email={employee.email}
                    phone={employee.phone}
                    role={employee.role}
                    avatar={employee.avatar}
                    onActivate={() => handleActivate(employee.id, employee.name)}
                  />
                ))
              ) : (
                <p className="text-muted-foreground col-span-full text-center py-8">
                  No deactivated employees
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <EmployeeFormModal open={modalOpen} onOpenChange={setModalOpen} mode="create" />
      </main>
    </div>
  );
};

export default Employees;
