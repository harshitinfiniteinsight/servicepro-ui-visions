import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface InvoiceDueAlertModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InvoiceDueAlertModal({ open, onOpenChange }: InvoiceDueAlertModalProps) {
  const [reminderDays, setReminderDays] = useState("1");
  const [emailAlertEnabled, setEmailAlertEnabled] = useState(true);
  const [smsAlertEnabled, setSmsAlertEnabled] = useState(true);

  const handleSave = () => {
    // TODO: Implement API call to save settings
    toast.success("Invoice Due Alert settings saved successfully");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">Invoice Due Alert</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                Configure automatic payment reminders
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Days Selection */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">
              Select days to send Invoice Due Alert to customer
            </Label>
            <Select value={reminderDays} onValueChange={setReminderDays}>
              <SelectTrigger className="w-full h-12 text-base border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 day</SelectItem>
                <SelectItem value="2">2 days</SelectItem>
                <SelectItem value="3">3 days</SelectItem>
                <SelectItem value="5">5 days</SelectItem>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="14">14 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
              </SelectContent>
            </Select>

            {/* Info Banner */}
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <p className="text-sm text-red-800 text-center">
                Invoice due reminder will be repeatedly sent to your customer every{" "}
                <span className="font-semibold">{reminderDays}</span>{" "}
                {reminderDays === "1" ? "day" : "days"} until paid
              </p>
            </div>
          </div>

          {/* Alert Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email Alert Card */}
            <Card className="border-2 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 pb-6">
                <div className="space-y-4">
                  <div className="text-center pb-3 border-b-2 border-gray-200">
                    <h3 className="text-lg font-bold text-foreground">Email Alert</h3>
                    <p className={cn(
                      "text-sm mt-1",
                      emailAlertEnabled ? "text-green-600" : "text-gray-500"
                    )}>
                      {emailAlertEnabled ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between px-2">
                    <Label htmlFor="email-alert" className="text-base font-medium cursor-pointer">
                      Email Alert
                    </Label>
                    <Switch
                      id="email-alert"
                      checked={emailAlertEnabled}
                      onCheckedChange={setEmailAlertEnabled}
                      className="scale-110"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SMS Alert Card */}
            <Card className="border-2 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 pb-6">
                <div className="space-y-4">
                  <div className="text-center pb-3 border-b-2 border-gray-200">
                    <h3 className="text-lg font-bold text-foreground">SMS Alert</h3>
                    <p className={cn(
                      "text-sm mt-1",
                      smsAlertEnabled ? "text-green-600" : "text-gray-500"
                    )}>
                      {smsAlertEnabled ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between px-2">
                    <Label htmlFor="sms-alert" className="text-base font-medium cursor-pointer">
                      SMS Alert
                    </Label>
                    <Switch
                      id="sms-alert"
                      checked={smsAlertEnabled}
                      onCheckedChange={setSmsAlertEnabled}
                      className="scale-110"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Save Button */}
          <div className="flex justify-center pt-4 border-t">
            <Button
              onClick={handleSave}
              size="lg"
              className="px-12 h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

