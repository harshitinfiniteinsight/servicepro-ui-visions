import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface ShareAppointmentModalProps {
  open: boolean;
  onClose: () => void;
  onShare: (options: { via: "email" | "sms" | "both"; audience: "customer" | "employee" | "both" }) => void;
  selectedCount: number;
}

const shareViaOptions = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "both", label: "Email & SMS" },
] as const;

const shareAudienceOptions = [
  { value: "customer", label: "Customer" },
  { value: "employee", label: "Employee" },
  { value: "both", label: "Both" },
] as const;

const ShareAppointmentModal = ({
  open,
  onClose,
  onShare,
  selectedCount,
}: ShareAppointmentModalProps) => {
  const [shareVia, setShareVia] = useState<"email" | "sms" | "both">("email");
  const [audience, setAudience] = useState<"customer" | "employee" | "both">("customer");

  useEffect(() => {
    if (open) {
      setShareVia("email");
      setAudience("customer");
    }
  }, [open]);

  const shareCopy = useMemo(() => {
    if (selectedCount <= 1) return "Share Appointment";
    return `Share ${selectedCount} Appointments`;
  }, [selectedCount]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-[calc(100%-2rem)] p-0 gap-0 rounded-3xl bg-white shadow-xl">
        <DialogHeader className="px-5 pt-5 pb-3 text-left">
          <DialogTitle className="text-lg font-semibold text-gray-900">Share</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Choose how you want to share the selected appointments.
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <div className="px-5 py-4 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Share via</h3>
            <RadioGroup
              value={shareVia}
              onValueChange={(value: "email" | "sms" | "both") => setShareVia(value)}
              className="grid grid-cols-3 gap-2"
            >
              {shareViaOptions.map(option => (
                <Label
                  key={option.value}
                  htmlFor={`share-via-${option.value}`}
                  className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-gray-200 px-3 py-2 text-[13px] font-medium text-gray-800 text-center data-[state=checked]:border-primary data-[state=checked]:bg-primary/5 transition-colors"
                >
                  <span>{option.label}</span>
                  <RadioGroupItem value={option.value} id={`share-via-${option.value}`} />
                </Label>
              ))}
            </RadioGroup>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Share with</h3>
            <RadioGroup
              value={audience}
              onValueChange={(value: "customer" | "employee" | "both") => setAudience(value)}
              className="grid grid-cols-3 gap-2"
            >
              {shareAudienceOptions.map(option => (
                <Label
                  key={option.value}
                  htmlFor={`share-audience-${option.value}`}
                  className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-gray-200 px-3 py-2 text-[13px] font-medium text-gray-800 text-center data-[state=checked]:border-primary data-[state=checked]:bg-primary/5 transition-colors"
                >
                  <span>{option.label}</span>
                  <RadioGroupItem value={option.value} id={`share-audience-${option.value}`} />
                </Label>
              ))}
            </RadioGroup>
          </div>

          <p className="text-xs text-muted-foreground">
            {selectedCount} appointment{selectedCount === 1 ? "" : "s"} selected
          </p>

          <Button
            onClick={() => {
              onShare({ via: shareVia, audience });
              onClose();
            }}
            className="w-full rounded-full bg-primary text-white py-3 text-sm font-semibold hover:bg-primary/90 shadow-md"
          >
            {shareCopy}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareAppointmentModal;

