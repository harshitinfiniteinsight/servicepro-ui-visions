import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
<<<<<<< HEAD
=======
import { X, ArrowLeft } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";
>>>>>>> 364b4fc (feat: Refactor navigation to sidebar, implement table view for estimates, and add convert to invoice option)

interface PayCashModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderAmount: number;
  orderId: string;
  onPaymentComplete?: () => void;
  entityType?: "invoice" | "estimate" | "agreement";
}

export function PayCashModal({
  open,
  onOpenChange,
  orderAmount,
  orderId,
  onPaymentComplete,
  entityType = "invoice",
}: PayCashModalProps) {
  const [amountReceived, setAmountReceived] = useState("");
  const [changeDue, setChangeDue] = useState<number | null>(null);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (!open) {
      setAmountReceived("");
      setChangeDue(null);
      setError("");
    }
  }, [open]);

  const handleAmountChange = (value: string) => {
    // Remove any non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    setAmountReceived(numericValue);
    setError("");
    
    // Calculate change automatically as user types
    const received = parseFloat(numericValue);
    if (!isNaN(received) && received > 0) {
      if (received >= orderAmount) {
        setChangeDue(received - orderAmount);
      } else {
        setChangeDue(null);
      }
    } else {
      setChangeDue(null);
    }
  };

  // Calculate change due
  const calculateChangeDue = () => {
    const received = parseFloat(amountReceived) || 0;
    const change = received - orderAmount;
    return change > 0 ? change : 0;
  };

  const handlePayCash = () => {
    const received = parseFloat(amountReceived);
    
    if (!amountReceived || isNaN(received)) {
      setError("Please enter amount received");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter amount received",
      });
      return;
    }

<<<<<<< HEAD
    if (received < orderAmount) {
      setError("Amount received cannot be less than order amount");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Amount received cannot be less than order amount",
      });
      return;
    }

    const change = received - orderAmount;

    if (change === 0) {
      toast({
        title: "Payment Successful",
        description: `Exact payment of $${orderAmount.toFixed(2)} received for order ${orderId}`,
      });
    } else {
      toast({
        title: "Payment Successful",
        description: `Payment received. Change due: $${change.toFixed(2)}`,
      });
    }

    // Call the callback to update agreement status
    if (onPaymentComplete) {
      onPaymentComplete();
    }
=======
    // Call the callback to update invoice status
    if (onPaymentComplete) {
      onPaymentComplete();
    }

    // Add payment notification
    const entityTypeLabel = entityType.charAt(0).toUpperCase() + entityType.slice(1);
    addNotification({
      entityType,
      entityId: orderId,
      message: `Payment received against ${entityTypeLabel}`,
      action: "convertToJob",
    });

    toast({
      title: "Payment Successful",
      description: `Cash payment of $${received.toFixed(2)} received for order ${orderId}`,
    });
>>>>>>> 364b4fc (feat: Refactor navigation to sidebar, implement table view for estimates, and add convert to invoice option)
    
    onOpenChange(false);
  };

  const changeDue = calculateChangeDue();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
<<<<<<< HEAD
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pay Cash</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Order Amount</Label>
            <Input value={`$${orderAmount.toLocaleString()}`} disabled />
=======
      <DialogContent className="sm:max-w-[460px] p-0 rounded-t-xl overflow-hidden max-h-[95vh] flex flex-col">
        <DialogHeader className="sr-only">
          <DialogTitle>Cash Payment</DialogTitle>
          <DialogDescription>Process cash payment</DialogDescription>
        </DialogHeader>
        
        {/* Orange Header */}
        <div className="bg-[#F46A1F] text-white px-4 py-3 flex items-center gap-3 rounded-t-xl">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-orange-600 h-8 w-8"
            onClick={() => onOpenChange(false)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-semibold flex-1 text-center">Cash Payment</h2>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-orange-600 h-8 w-8"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6 flex-1 overflow-hidden flex flex-col">
          {/* Order Amount Section - Centered */}
          <div className="flex flex-col items-center space-y-2">
            <Label className="text-sm text-gray-600 text-center">Order Amount</Label>
            <p className="text-3xl font-bold text-gray-900">${orderAmount.toFixed(2)}</p>
>>>>>>> 364b4fc (feat: Refactor navigation to sidebar, implement table view for estimates, and add convert to invoice option)
          </div>
          
          <div className="space-y-2">
            <Label>Amount Received</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                type="text"
                placeholder="0.00"
                value={amountReceived}
                onChange={(e) => handleAmountChange(e.target.value)}
<<<<<<< HEAD
                className={`pl-7 ${error ? "border-destructive" : ""}`}
=======
                className={`h-12 pl-7 bg-gray-50 border-2 rounded-lg focus:border-[#F46A1F] focus:ring-2 focus:ring-[#F46A1F]/20 transition-all ${
                  error ? "border-red-500" : "border-gray-300"
                }`}
>>>>>>> 364b4fc (feat: Refactor navigation to sidebar, implement table view for estimates, and add convert to invoice option)
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

<<<<<<< HEAD
          {changeDue !== null && (
            <div className="bg-success/10 border border-success/20 rounded-lg p-4">
              <p className="text-sm font-medium text-success">Change Due</p>
              <p className="text-2xl font-bold text-success">${changeDue.toFixed(2)}</p>
            </div>
          )}

          <Button 
            onClick={handlePayCash} 
            className="w-full"
            disabled={!amountReceived}
=======
          {/* Change Due Box */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-1">
            <Label className="text-sm text-gray-600">Change Due</Label>
            <p className="text-2xl font-bold text-green-600">${changeDue.toFixed(2)}</p>
          </div>

          {/* Pay Cash Button */}
          <Button 
            onClick={handlePayCash} 
            className="w-full h-12 bg-[#F46A1F] hover:bg-[#F46A1F]/90 text-white font-semibold rounded-lg text-base"
            disabled={!amountReceived || parseFloat(amountReceived) <= 0}
>>>>>>> 364b4fc (feat: Refactor navigation to sidebar, implement table view for estimates, and add convert to invoice option)
          >
            Pay Cash
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
