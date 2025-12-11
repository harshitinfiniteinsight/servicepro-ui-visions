import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Employee {
  id: string;
  name: string;
  role: string;
  status?: string;
}

interface ReassignEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string;
  jobOrderId?: string;
  currentEmployeeId?: string;
  employeesList: Employee[];
  onSave?: (newEmployeeId: string) => Promise<void>;
}

export const ReassignEmployeeModal = ({
  open,
  onOpenChange,
  jobId,
  jobOrderId,
  currentEmployeeId,
  employeesList,
  onSave,
}: ReassignEmployeeModalProps) => {
  const { toast } = useToast();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  // Reset selected employee when modal opens
  useEffect(() => {
    if (open) {
      setSelectedEmployeeId(currentEmployeeId || "");
    }
  }, [open, currentEmployeeId]);

  // Filter active employees
  const activeEmployees = employeesList.filter((emp) => emp.status === "Active" || !emp.status);

  // Handle Save
  const handleSave = async () => {
    if (!selectedEmployeeId) {
      toast({
        title: "No employee selected",
        description: "Please select an employee before saving",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      if (onSave) {
        await onSave(selectedEmployeeId);
      } else {
        // Default behavior: simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      toast({
        title: "Employee reassigned",
        description: "The job has been successfully reassigned to the selected employee",
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Reassignment failed",
        description: "Failed to reassign employee. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const selectedEmployee = activeEmployees.find((emp) => emp.id === selectedEmployeeId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[65%] md:max-w-[600px] max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Reassign Employee</DialogTitle>
          <DialogDescription>Select a new employee for this job</DialogDescription>
        </DialogHeader>

        {/* Orange Header Bar */}
        <div className="bg-orange-500 text-white px-6 py-5 flex items-center justify-between rounded-t-lg">
          <h2 className="text-xl font-bold text-white">Reassign Employee</h2>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-orange-600 h-8 w-8"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Body Content */}
        <div className="px-6 py-8 space-y-6">
          <div className="space-y-3">
            <Label className="text-base font-semibold text-foreground">Select New Employee</Label>
            <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
              <SelectTrigger className="w-full h-12 text-base rounded-lg border-2 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                <SelectValue placeholder="Choose employee" />
              </SelectTrigger>
              <SelectContent className="z-50 bg-popover max-h-[300px]">
                {activeEmployees.length === 0 ? (
                  <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                    No active employees available
                  </div>
                ) : (
                  activeEmployees.map((employee) => (
                    <SelectItem
                      key={employee.id}
                      value={employee.id}
                      className="text-base py-3 cursor-pointer focus:bg-orange-50"
                    >
                      {employee.name} — {employee.role}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Save Button */}
        <div className="px-6 pb-6 flex justify-center">
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !selectedEmployeeId}
            className={cn(
              "w-[65%] sm:w-[70%] h-12 text-base font-semibold rounded-lg",
              "border-2 border-orange-500 text-orange-500 bg-transparent",
              "hover:bg-orange-50 hover:border-orange-600 hover:text-orange-600",
              "focus:ring-2 focus:ring-orange-500 focus:ring-offset-2",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-all duration-200"
            )}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};



