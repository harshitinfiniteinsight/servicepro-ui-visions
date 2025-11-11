import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileHeader from "@/components/layout/MobileHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Mail, Phone, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

const AddEmployee = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    status: "Active",
    specialties: [] as string[],
  });

  const roles = [
    "Senior Technician",
    "Technician",
    "Electrician",
    "Apprentice",
    "Office Manager",
    "Sales Rep",
    "Dispatcher",
    "Accountant",
  ];

  const specialtyOptions = [
    "HVAC",
    "Plumbing",
    "Electrical",
    "General",
    "Administration",
    "Sales",
    "Dispatch",
    "Finance",
  ];

  const toggleSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const handleSubmit = () => {
    // In real app, create employee
    navigate("/employees");
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <MobileHeader title="New Employee" showBack={true} />
      
      <div className="flex-1 overflow-y-auto scrollable pt-14 px-4 pb-6 space-y-4">
        {/* Avatar Section */}
        <div className="flex flex-col items-center py-4">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-2">
            <User className="h-10 w-10 text-primary" />
          </div>
          <Button variant="outline" size="sm">Change Photo</Button>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <Label>Full Name *</Label>
            <Input
              placeholder="Enter employee name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <Label>Email *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="employee@servicepro.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label>Phone *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="tel"
                placeholder="(555) 111-0001"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label>Role *</Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Specialties</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {specialtyOptions.map(specialty => (
                <button
                  key={specialty}
                  type="button"
                  onClick={() => toggleSpecialty(specialty)}
                  className={cn(
                    "p-3 rounded-lg border text-left transition-colors",
                    formData.specialties.includes(specialty)
                      ? "bg-primary/10 border-primary"
                      : "bg-card hover:bg-accent/5"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{specialty}</span>
                    {formData.specialties.includes(specialty) && (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-xs text-primary-foreground">✓</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t bg-background space-y-2">
        <Button
          className="w-full"
          size="lg"
          onClick={handleSubmit}
          disabled={!formData.name || !formData.email || !formData.phone || !formData.role}
        >
          Create Employee
        </Button>
        <Button variant="ghost" className="w-full" onClick={() => navigate("/employees")}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default AddEmployee;

