import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface SendCurrentReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SendCurrentReportModal({ open, onOpenChange }: SendCurrentReportModalProps) {
  const [sendEmail, setSendEmail] = useState(false);
  const [sendPhone, setSendPhone] = useState(false);
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSend = () => {
    if (!sendEmail && !sendPhone) {
      toast.error("Please select at least one delivery method");
      return;
    }

    if (sendEmail && !email) {
      toast.error("Please enter an email address");
      return;
    }

    if (sendPhone && !phoneNumber) {
      toast.error("Please enter a phone number");
      return;
    }

    // Validate email format if email is selected
    if (sendEmail && email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address");
        return;
      }
    }

    // Send report logic here
    const deliveryMethods = [];
    if (sendEmail) deliveryMethods.push(`Email: ${email}`);
    if (sendPhone) deliveryMethods.push(`Phone: ${countryCode}${phoneNumber}`);

    toast.success(`Current report sent successfully to ${deliveryMethods.join(" and ")}`);
    
    // Reset form
    setSendEmail(false);
    setSendPhone(false);
    setEmail("");
    setCountryCode("+1");
    setPhoneNumber("");
    onOpenChange(false);
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      // Reset form when closing
      setSendEmail(false);
      setSendPhone(false);
      setEmail("");
      setCountryCode("+1");
      setPhoneNumber("");
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Send Current Report</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Email Checkbox and Input */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="email-checkbox"
                checked={sendEmail}
                onCheckedChange={(checked) => setSendEmail(checked as boolean)}
              />
              <Label htmlFor="email-checkbox" className="text-sm font-semibold cursor-pointer">
                Email
              </Label>
            </div>
            {sendEmail && (
              <div>
                <Label htmlFor="email" className="text-sm text-muted-foreground mb-2 block">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Phone Checkbox and Input */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="phone-checkbox"
                checked={sendPhone}
                onCheckedChange={(checked) => setSendPhone(checked as boolean)}
              />
              <Label htmlFor="phone-checkbox" className="text-sm font-semibold cursor-pointer">
                Phone Number
              </Label>
            </div>
            {sendPhone && (
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">
                  Phone Number with Country Code
                </Label>
                <div className="flex gap-2">
                  <Select value={countryCode} onValueChange={setCountryCode}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+1">+1 (US/CA)</SelectItem>
                      <SelectItem value="+44">+44 (UK)</SelectItem>
                      <SelectItem value="+91">+91 (IN)</SelectItem>
                      <SelectItem value="+86">+86 (CN)</SelectItem>
                      <SelectItem value="+81">+81 (JP)</SelectItem>
                      <SelectItem value="+49">+49 (DE)</SelectItem>
                      <SelectItem value="+33">+33 (FR)</SelectItem>
                      <SelectItem value="+61">+61 (AU)</SelectItem>
                      <SelectItem value="+52">+52 (MX)</SelectItem>
                      <SelectItem value="+55">+55 (BR)</SelectItem>
                      <SelectItem value="+7">+7 (RU)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                    placeholder="Phone number"
                    className="flex-1"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Send Button */}
          <div className="pt-4">
            <Button
              onClick={handleSend}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold py-6"
            >
              Send
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

