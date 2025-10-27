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
  const [emailBody, setEmailBody] = useState("");

  const handleSend = () => {
    // Email sending logic here
    console.log("Sending email to:", email);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send Email</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Email send to</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label>Email Body</Label>
            <Textarea
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              placeholder="Type your email message here..."
              className="min-h-[200px]"
            />
          </div>

          <Button onClick={handleSend} className="w-full">
            Send
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
