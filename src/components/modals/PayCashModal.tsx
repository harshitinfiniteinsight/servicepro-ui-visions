import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface PayCashModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderAmount: number;
  orderId: string;
}

export function PayCashModal({
  open,
  onOpenChange,
  orderAmount,
  orderId,
}: PayCashModalProps) {
  const [amountReceived, setAmountReceived] = useState("");
  const [changeDue, setChangeDue] = useState<number | null>(null);
  const [error, setError] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (!open) {
      setAmountReceived("");
      setChangeDue(null);
      setError("");
    }
  }, [open]);

  const handleAmountChange = (value: string) => {
    setAmountReceived(value);
    setError("");
    setChangeDue(null);
  };

  const handlePayCash = () => {
    const received = parseFloat(amountReceived);
    
    if (isNaN(received) || received < orderAmount) {
      setError("Amount received cannot be less than the order amount");
      return;
    }

    const change = received - orderAmount;
    
    if (change > 0) {
      setChangeDue(change);
      toast({
        title: "Payment Recorded",
        description: `Change due: $${change.toFixed(2)}`,
      });
    } else {
      toast({
        title: "Payment Recorded",
        description: `Cash payment of $${received.toFixed(2)} recorded for ${orderId}`,
      });
      onOpenChange(false);
    }
  };

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
            <Input
              type="number"
              placeholder="Enter amount received"
              value={amountReceived}
              onChange={(e) => handleAmountChange(e.target.value)}
              min={orderAmount}
              step="0.01"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

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
          >
            Pay Cash
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
