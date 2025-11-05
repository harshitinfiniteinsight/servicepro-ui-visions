import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Zap, Wifi, MoreVertical, CreditCard, DollarSign, RefreshCw, Building2, X } from "lucide-react";
import { toast } from "sonner";
import { CardDetailsModal } from "./CardDetailsModal";
import { ACHPaymentModal } from "./ACHPaymentModal";

interface InvoicePaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: any;
}

export const InvoicePaymentModal = ({ open, onOpenChange, invoice }: InvoicePaymentModalProps) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"tap" | "card" | "cash" | "ach" | null>(null);
  const [showCardDetailsModal, setShowCardDetailsModal] = useState(false);
  const [showACHModal, setShowACHModal] = useState(false);

  if (!invoice) return null;

  const totalAmount = invoice.amount || 0;

  const handlePaymentMethodSelect = (method: "tap" | "card" | "cash" | "ach") => {
    setSelectedPaymentMethod(method);
    if (method === "cash") {
      toast.success("Cash payment selected");
      // Handle cash payment
    } else if (method === "card") {
      setShowCardDetailsModal(true);
    } else if (method === "tap") {
      toast.success("Tap to Pay selected");
      // Handle tap to pay
    } else if (method === "ach") {
      setShowACHModal(true);
    }
  };

  const handlePaymentComplete = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[#3F8C8C] text-white px-4 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-[#2d6b6b] h-8 w-8"
            onClick={() => onOpenChange(false)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-semibold flex-1">Service Pro911 - Payment</h2>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-[#2d6b6b] h-8 w-8"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Total Amount Section */}
          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative mb-4">
              <div className="h-20 w-20 rounded-full bg-[#A7E0D9] flex items-center justify-center">
                <RefreshCw className="h-10 w-10 text-[#3F8C8C]" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-2">Total Amount</p>
            <p className="text-4xl font-bold text-foreground">${totalAmount.toFixed(2)}</p>
          </div>

          {/* Floating Overlay Bar */}
          <div className="bg-gray-800 rounded-lg px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Zap className="h-5 w-5 text-white" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-6 w-0.5 bg-white rotate-45" />
                </div>
              </div>
              <div className="h-5 w-px bg-gray-600" />
              <div className="relative">
                <Wifi className="h-5 w-5 text-white" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-6 w-0.5 bg-white rotate-45" />
                </div>
              </div>
            </div>
            <MoreVertical className="h-5 w-5 text-white" />
          </div>

          {/* Payment Options Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">Payment Options</h3>

            {/* Payment Method Cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Tap to Pay */}
              <Card
                className={`cursor-pointer transition-all hover:shadow-md bg-white ${
                  selectedPaymentMethod === "tap"
                    ? "border-[#3F8C8C] border-2 bg-[#A7E0D9]/10"
                    : "border-gray-200"
                }`}
                onClick={() => handlePaymentMethodSelect("tap")}
              >
                <CardContent className="pt-6 pb-4 flex flex-col items-center justify-center min-h-[120px]">
                  <div className="mb-3">
                    <Zap className="h-10 w-10 text-[#3F8C8C]" />
                  </div>
                  <p className="text-sm font-medium text-center text-foreground">Tap to Pay</p>
                </CardContent>
              </Card>

              {/* Enter Card Manually */}
              <Card
                className={`cursor-pointer transition-all hover:shadow-md bg-white ${
                  selectedPaymentMethod === "card"
                    ? "border-[#3F8C8C] border-2 bg-[#A7E0D9]/10"
                    : "border-gray-200"
                }`}
                onClick={() => handlePaymentMethodSelect("card")}
              >
                <CardContent className="pt-6 pb-4 flex flex-col items-center justify-center min-h-[120px]">
                  <div className="mb-3">
                    <CreditCard className="h-10 w-10 text-[#3F8C8C]" />
                  </div>
                  <p className="text-sm font-medium text-center text-foreground">Enter Card Manually</p>
                </CardContent>
              </Card>

              {/* ACH Payment */}
              <Card
                className={`cursor-pointer transition-all hover:shadow-md bg-white ${
                  selectedPaymentMethod === "ach"
                    ? "border-[#3F8C8C] border-2 bg-[#A7E0D9]/10"
                    : "border-gray-200"
                }`}
                onClick={() => handlePaymentMethodSelect("ach")}
              >
                <CardContent className="pt-6 pb-4 flex flex-col items-center justify-center min-h-[120px]">
                  <div className="mb-3">
                    <Building2 className="h-10 w-10 text-[#3F8C8C]" />
                  </div>
                  <p className="text-sm font-medium text-center text-foreground">ACH Payment</p>
                </CardContent>
              </Card>

              {/* Pay by Cash */}
              <Card
                className={`cursor-pointer transition-all hover:shadow-md bg-white ${
                  selectedPaymentMethod === "cash"
                    ? "border-[#3F8C8C] border-2 bg-[#A7E0D9]/10"
                    : "border-gray-200"
                }`}
                onClick={() => handlePaymentMethodSelect("cash")}
              >
                <CardContent className="pt-6 pb-4 flex flex-col items-center justify-center min-h-[120px]">
                  <div className="mb-3">
                    <DollarSign className="h-10 w-10 text-[#3F8C8C]" />
                  </div>
                  <p className="text-sm font-medium text-center text-foreground">Pay by Cash</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>

      <CardDetailsModal
        open={showCardDetailsModal}
        onOpenChange={setShowCardDetailsModal}
        totalAmount={totalAmount}
        onPaymentComplete={handlePaymentComplete}
      />

      <ACHPaymentModal
        open={showACHModal}
        onOpenChange={setShowACHModal}
        totalAmount={totalAmount}
        onPaymentComplete={handlePaymentComplete}
      />
    </Dialog>
  );
};
