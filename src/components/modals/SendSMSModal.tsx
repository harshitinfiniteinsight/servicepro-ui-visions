import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

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

  useEffect(() => {
    if (open) {
      setPhone(phoneNumber);
    }
  }, [phoneNumber, open]);

  const handleSend = () => {
    // SMS sending logic here
    console.log("Sending SMS to:", `${countryCode}${phone}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 bg-white rounded-xl overflow-hidden">
        {/* Header with orange background */}
        <DialogHeader className="bg-[#F46A1F] text-white p-6 pb-4">
          <DialogDescription className="sr-only">
            Send SMS to customer
          </DialogDescription>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-white">Send SMS</DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-orange-600 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        </DialogHeader>

        {/* Content Area */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-600 font-semibold">Mobile Number :</Label>
            <div className="flex gap-2">
              <Input
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-24 border border-gray-300 rounded-md"
                placeholder="+1"
              />
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
                className="flex-1 border border-gray-300 rounded-md text-gray-900 font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-600 font-semibold">Message :</Label>
            <textarea
              placeholder="Type your message here..."
              className="w-full min-h-[120px] border border-gray-300 rounded-md p-3 text-gray-900 font-medium resize-none focus:border-[#F46A1F] focus:ring-2 focus:ring-[#F46A1F]/20 transition-all"
            />
          </div>

          <Button 
            onClick={handleSend} 
            className="w-full bg-[#F46A1F] hover:bg-[#F46A1F]/90 text-white font-semibold py-2 rounded-xl"
          >
            SEND
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
