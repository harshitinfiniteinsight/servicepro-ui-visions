import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SendSMSModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerName: string;
  phoneNumber: string;
}

export const SendSMSModal = ({
  open,
  onOpenChange,
  customerName,
  phoneNumber,
}: SendSMSModalProps) => {
  const [countryCode, setCountryCode] = useState("+1");
  const [phone, setPhone] = useState(phoneNumber);
  const [message, setMessage] = useState("");

  const handleSend = () => {
    // SMS sending logic here
    console.log("Sending SMS to:", `${countryCode}${phone}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send SMS</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Send SMS to</Label>
            <div className="flex gap-2">
              <Input
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-20"
                placeholder="+1"
              />
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Customer name</Label>
            <Input value={customerName} disabled />
          </div>

          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="min-h-[120px]"
            />
          </div>

          <Button onClick={handleSend} className="w-full">
            Send SMS
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
