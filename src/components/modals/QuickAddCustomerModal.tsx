import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

interface QuickAddCustomerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickAddCustomerModal({ open, onOpenChange }: QuickAddCustomerModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Customer Added",
      description: `${formData.firstName} ${formData.lastName} has been added successfully.`,
    });
    onOpenChange(false);
    setFormData({ firstName: "", lastName: "", email: "", phone: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-0 rounded-xl overflow-hidden">
        <DialogHeader className="bg-[#F46A1F] text-white p-6 pb-4">
          <DialogDescription className="sr-only">
            Quickly add a new customer
          </DialogDescription>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl md:text-2xl font-bold text-white">Quick Add Customer</DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-orange-600 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        </DialogHeader>
        <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              placeholder="John"
              required
            />
          </div>

          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder="Doe"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john.doe@example.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
              required
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-[#F46A1F] hover:bg-[#F46A1F]/90 text-white">
              Quick Add
            </Button>
          </div>
        </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
