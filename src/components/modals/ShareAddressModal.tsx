import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockEmployees } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

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
  const [countryCode, setCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { toast } = useToast();

  const handleSend = () => {
    toast({
      title: "Address Shared",
      description: phoneNumber 
        ? `Job address sent to ${countryCode}${phoneNumber}`
        : selectedEmployee === "all" 
        ? "Job address sent to all employees"
        : "Job address sent successfully",
    });
    onOpenChange(false);
    setSelectedEmployee("all");
    setPhoneNumber("");
    setCountryCode("+1");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader className="bg-primary text-primary-foreground p-6 -mt-6 -mx-6 mb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">Share Address</DialogTitle>
            <Button
              variant="ghost"
              className="text-primary-foreground hover:bg-primary-foreground/20 h-8 w-8 p-0"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-5 w-5" />
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
            <Label className="text-lg text-muted-foreground">Enter Phone Number</Label>
            <div className="flex gap-2">
              <Select value={countryCode} onValueChange={setCountryCode}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-50 bg-popover">
                  <SelectItem value="+1">+1</SelectItem>
                  <SelectItem value="+44">+44</SelectItem>
                  <SelectItem value="+91">+91</SelectItem>
                  <SelectItem value="+86">+86</SelectItem>
                  <SelectItem value="+81">+81</SelectItem>
                  <SelectItem value="+49">+49</SelectItem>
                  <SelectItem value="+33">+33</SelectItem>
                  <SelectItem value="+61">+61</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="Phone number"
                className="flex-1"
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
