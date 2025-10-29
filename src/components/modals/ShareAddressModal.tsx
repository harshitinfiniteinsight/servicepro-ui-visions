import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { mockEmployees } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

interface ShareAddressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobAddress: string;
  jobId: string;
}

export const ShareAddressModal = ({
  open,
  onOpenChange,
  jobAddress,
  jobId,
}: ShareAddressModalProps) => {
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");
  const [message, setMessage] = useState(`Job Address for ${jobId}: ${jobAddress}`);
  const { toast } = useToast();

  const handleSend = () => {
    toast({
      title: "Address Shared",
      description: selectedEmployee === "all" 
        ? "Job address sent to all employees"
        : "Job address sent successfully",
    });
    onOpenChange(false);
    setSelectedEmployee("all");
    setMessage(`Job Address for ${jobId}: ${jobAddress}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader className="bg-primary text-primary-foreground p-6 -mt-6 -mx-6 mb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">Share Address</DialogTitle>
            <Button
              variant="ghost"
              className="text-primary-foreground hover:bg-primary-foreground/20 h-auto p-2"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-lg text-muted-foreground">Select Employee</Label>
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger>
                <SelectValue placeholder="Choose employee" />
              </SelectTrigger>
              <SelectContent className="z-50 bg-popover">
                <SelectItem value="all">All Employees</SelectItem>
                {mockEmployees
                  .filter((emp) => emp.status === "Active")
                  .map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name} - {employee.role}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="text-center text-2xl font-semibold text-muted-foreground">
            OR
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 rounded border-2 border-input flex items-center justify-center text-2xl text-primary font-semibold">
                1
              </div>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter custom message..."
                className="flex-1 min-h-[100px]"
              />
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button
              onClick={handleSend}
              className="w-64 h-14 text-lg"
              variant="outline"
            >
              SEND
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
