import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface SendSMSModalProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber: string;
  customerName?: string;
}

const SendSMSModal = ({
  isOpen,
  onClose,
  phoneNumber,
  customerName,
}: SendSMSModalProps) => {
  const [countryCode, setCountryCode] = useState("+1");
  const [phone, setPhone] = useState(phoneNumber);

  useEffect(() => {
    if (isOpen) {
      // Extract country code if phone number starts with +
      if (phoneNumber.startsWith("+")) {
        const parts = phoneNumber.split(" ");
        if (parts.length > 1) {
          setCountryCode(parts[0]);
          setPhone(parts.slice(1).join(" "));
        } else {
          // Try to extract first few digits as country code
          const match = phoneNumber.match(/^(\+\d{1,3})(.*)$/);
          if (match) {
            setCountryCode(match[1]);
            setPhone(match[2]);
          } else {
            setPhone(phoneNumber);
          }
        }
      } else {
        setPhone(phoneNumber);
      }
    }
  }, [phoneNumber, isOpen]);

  const handleSend = () => {
    if (!phone || phone.trim().length === 0) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    const fullPhoneNumber = `${countryCode}${phone}`;
    toast.success(`SMS sent successfully to ${fullPhoneNumber}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-[calc(100%-2rem)] p-0 gap-0 rounded-2xl max-h-[85vh] overflow-hidden">
        <DialogDescription className="sr-only">
          Send SMS to {customerName || phoneNumber}
        </DialogDescription>
        
        {/* Header with orange background */}
        <div className="bg-orange-500 text-white px-4 py-4 flex items-center justify-between safe-top">
          <h2 className="text-lg sm:text-xl font-bold text-white">Send SMS</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-orange-600 h-9 px-3 rounded-md"
          >
            <span className="text-sm sm:text-base font-semibold">Close</span>
          </Button>
        </div>

        {/* Content Area */}
        <div className="bg-white py-6 sm:py-8 space-y-6 sm:space-y-8 overflow-y-auto safe-bottom overflow-x-hidden">
          <div className="space-y-3 px-8 sm:px-10">
            <Label className="text-sm text-gray-600 font-semibold">Mobile Number :</Label>
            <div className="flex gap-2">
              <Input
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-24 border border-gray-300 rounded-md text-sm"
                placeholder="+1"
              />
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
                className="flex-1 border border-gray-300 rounded-md text-orange-500 font-medium text-base"
              />
            </div>
          </div>

          <div className="px-8 sm:px-10 pt-2 pb-4">
            <Button 
              onClick={handleSend} 
              className="w-full border-2 border-orange-500 text-orange-500 bg-white hover:bg-orange-50 font-semibold py-4 px-6 text-base"
            >
              SEND
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendSMSModal;

