import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

interface PayCashModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderAmount: number;
  orderId: string;
  onPaymentComplete?: () => void;
}

export function PayCashModal({
  open,
  onOpenChange,
  orderAmount,
  orderId,
  onPaymentComplete,
}: PayCashModalProps) {
  const [amountReceived, setAmountReceived] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (!open) {
      setAmountReceived("");
      setError("");
    }
  }, [open]);

  const handleAmountChange = (value: string) => {
    // Remove any non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    setAmountReceived(numericValue);
    setError("");
  };

  const handlePayCash = () => {
    const received = parseFloat(amountReceived);
    
    if (!amountReceived || isNaN(received) || received <= 0) {
      setError("Please enter amount received");
      return;
    }

    if (received < orderAmount) {
      setError("Amount received must be greater than or equal to order amount");
      return;
    }

    // Call the callback to update invoice status
    if (onPaymentComplete) {
      onPaymentComplete();
    }

    toast({
      title: "Payment Successful",
      description: `Cash payment of $${received.toFixed(2)} received for order ${orderId}`,
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 rounded-xl overflow-hidden">
        <DialogHeader className="bg-white text-gray-900 p-6 pb-4 border-b">
          <DialogDescription className="sr-only">
            Process cash payment for invoice
          </DialogDescription>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl md:text-2xl font-bold text-gray-900">Pay Cash</DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Order Amount */}
          <div className="space-y-2">
            <Label className="text-base font-semibold text-gray-900">Order Amount</Label>
            <Input
              value={`$${orderAmount.toFixed(2)}`}
              disabled
              className="h-12 bg-gray-50 text-gray-900 font-medium cursor-not-allowed"
            />
          </div>
          
          {/* Amount Received */}
          <div className="space-y-2">
            <Label className="text-base font-semibold text-gray-900">Amount Received</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
              <Input
                type="text"
                placeholder="0.00"
                value={amountReceived}
                onChange={(e) => handleAmountChange(e.target.value)}
                className={`h-12 pl-7 border-2 focus:border-[#F46A1F] focus:ring-2 focus:ring-[#F46A1F]/20 transition-all ${
                  error ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 mt-1">{error}</p>
            )}
          </div>

          {/* Pay Cash Button */}
          <Button 
            onClick={handlePayCash} 
            className="w-full h-12 bg-[#F46A1F] hover:bg-[#F46A1F]/90 text-white font-semibold rounded-xl"
            disabled={!amountReceived || parseFloat(amountReceived) < orderAmount}
          >
            Pay Cash
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
