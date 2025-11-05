import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Zap, Wifi, MoreVertical, CreditCard, DollarSign, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface AgreementPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agreement: any;
}

export const AgreementPaymentModal = ({ open, onOpenChange, agreement }: AgreementPaymentModalProps) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"tap" | "card" | "cash" | null>(null);
  const [cardReaderConnected, setCardReaderConnected] = useState(false);

  if (!agreement) return null;

  const totalAmount = agreement.amount || 0;

  const handlePaymentMethodSelect = (method: "tap" | "card" | "cash") => {
    setSelectedPaymentMethod(method);
    if (method === "cash") {
      toast.success("Cash payment selected");
      // Handle cash payment
    } else if (method === "card") {
      toast.success("Card payment selected");
      // Handle card payment - could open another modal for card details
    } else if (method === "tap") {
      toast.success("Tap to Pay selected");
      // Handle tap to pay
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-teal-600 text-white px-4 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-teal-700 h-8 w-8"
            onClick={() => onOpenChange(false)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-semibold flex-1">Service Pro911 - Payment</h2>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Total Amount Section */}
          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative mb-4">
              <div className="h-20 w-20 rounded-full bg-teal-100 flex items-center justify-center">
                <RefreshCw className="h-10 w-10 text-teal-600" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-2">Total Amount</p>
            <p className="text-4xl font-bold text-foreground">${totalAmount.toFixed(2)}</p>
          </div>

          {/* Floating Overlay Bar */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Zap className="h-5 w-5 text-gray-400" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-6 w-0.5 bg-gray-400 rotate-45" />
                </div>
              </div>
              <div className="h-5 w-px bg-gray-600" />
              <div className="relative">
                <Wifi className="h-5 w-5 text-gray-400" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-6 w-0.5 bg-gray-400 rotate-45" />
                </div>
              </div>
            </div>
            <MoreVertical className="h-5 w-5 text-gray-400" />
          </div>

          {/* Payment Options Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">Payment Options</h3>

            {/* Card Reader Status */}
            {!cardReaderConnected && (
              <Card className="mb-4 border-blue-200">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    Card reader is not connected. You may connect your reader via Bluetooth or USB at anytime.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full bg-teal-600 text-white hover:bg-teal-700 border-teal-600"
                    onClick={() => {
                      setCardReaderConnected(true);
                      toast.success("Card reader connected");
                    }}
                  >
                    Continue
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Payment Method Cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Tap to Pay */}
              <Card
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedPaymentMethod === "tap"
                    ? "border-teal-600 border-2 bg-teal-50"
                    : "border-blue-200"
                }`}
                onClick={() => handlePaymentMethodSelect("tap")}
              >
                <CardContent className="pt-6 pb-4 flex flex-col items-center justify-center min-h-[120px]">
                  <div className="mb-3">
                    <Zap className="h-10 w-10 text-teal-600" />
                  </div>
                  <p className="text-sm font-medium text-center">Tap to Pay</p>
                </CardContent>
              </Card>

              {/* Enter Card Manually */}
              <Card
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedPaymentMethod === "card"
                    ? "border-teal-600 border-2 bg-teal-50"
                    : "border-blue-200"
                }`}
                onClick={() => handlePaymentMethodSelect("card")}
              >
                <CardContent className="pt-6 pb-4 flex flex-col items-center justify-center min-h-[120px]">
                  <div className="mb-3">
                    <CreditCard className="h-10 w-10 text-teal-600" />
                  </div>
                  <p className="text-sm font-medium text-center">Enter Card Manually</p>
                </CardContent>
              </Card>

              {/* Pay by Cash */}
              <Card
                className={`cursor-pointer transition-all hover:shadow-md col-span-2 ${
                  selectedPaymentMethod === "cash"
                    ? "border-teal-600 border-2 bg-teal-50"
                    : "border-blue-200"
                }`}
                onClick={() => handlePaymentMethodSelect("cash")}
              >
                <CardContent className="pt-6 pb-4 flex flex-col items-center justify-center min-h-[120px]">
                  <div className="mb-3">
                    <DollarSign className="h-10 w-10 text-teal-600" />
                  </div>
                  <p className="text-sm font-medium text-center">Pay by Cash</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
