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

interface SendEmailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerEmail: string;
}

export const SendEmailModal = ({
  open,
  onOpenChange,
  customerEmail,
}: SendEmailModalProps) => {
  const [email, setEmail] = useState(customerEmail);

  useEffect(() => {
    if (open) {
      setEmail(customerEmail);
    }
  }, [customerEmail, open]);

  const handleSend = () => {
    // Email sending logic here
    console.log("Sending email to:", email);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 bg-white rounded-xl overflow-hidden">
        {/* Header with orange background */}
        <DialogHeader className="bg-[#F46A1F] text-white p-6 pb-4">
          <DialogDescription className="sr-only">
            Send email to customer
          </DialogDescription>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-white">Send email</DialogTitle>
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
            <Label className="text-gray-600">Email send to :</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@example.com"
              className="border-0 border-b-2 border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-[#F46A1F] text-gray-900 font-medium"
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
