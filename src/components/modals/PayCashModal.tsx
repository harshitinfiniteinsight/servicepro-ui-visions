import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/contexts/NotificationContext";

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
  const [error, setError] = useState("");
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (!open) {
      setAmountReceived("");
      setError("");
    }
  }, [open]);

  const handleAmountChange = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    setAmountReceived(numericValue);
    setError("");
  };

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

    if (onPaymentComplete) {
      onPaymentComplete();
    }

    const entityTypeLabel = entityType.charAt(0).toUpperCase() + entityType.slice(1);
    addNotification({
      entityType,
      entityId: orderId,
      message: `Payment received against ${entityTypeLabel}`,
      action: "convertToJob",
    });

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
    
    onOpenChange(false);
  };

  const changeDue = calculateChangeDue();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pay Cash</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Order Amount</Label>
            <Input value={`$${orderAmount.toLocaleString()}`} disabled />
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
                className={`pl-7 ${error ? "border-destructive" : ""}`}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          {changeDue > 0 && (
            <div className="bg-success/10 border border-success/20 rounded-lg p-4">
              <p className="text-sm font-medium text-success">Change Due</p>
              <p className="text-2xl font-bold text-success">${changeDue.toFixed(2)}</p>
            </div>
          )}

          <Button 
            onClick={handlePayCash} 
            className="w-full"
            disabled={!amountReceived}
          >
            Pay Cash
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}