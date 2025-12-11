import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Zap, Wifi, MoreVertical, CreditCard, DollarSign, RefreshCw, Building2, X } from "lucide-react";
import { toast } from "sonner";
import { CardDetailsModal } from "./CardDetailsModal";
import { ACHPaymentModal } from "./ACHPaymentModal";
import { PayCashModal } from "./PayCashModal";
import { useNotifications } from "@/contexts/NotificationContext";

interface AgreementPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agreement: any;
}

export const AgreementPaymentModal = ({ open, onOpenChange, agreement }: AgreementPaymentModalProps) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"tap" | "card" | "cash" | "ach" | null>(null);
  const [showCardDetailsModal, setShowCardDetailsModal] = useState(false);
  const [showACHModal, setShowACHModal] = useState(false);
  const [showPayCashModal, setShowPayCashModal] = useState(false);
  const { addNotification } = useNotifications();

  if (!agreement) return null;

  const totalAmount = agreement.amount || 0;
  const entityId = agreement.id || "";

  const handlePaymentMethodSelect = (method: "tap" | "card" | "cash" | "ach") => {
    setSelectedPaymentMethod(method);
    if (method === "cash") {
      setShowPayCashModal(true);
    } else if (method === "card") {
      setShowCardDetailsModal(true);
    } else if (method === "tap") {
      // Simulate tap to pay success and add notification
      const entityTypeLabel = "Agreement";
      addNotification({
        entityType: "agreement",
        entityId,
        message: `Payment received against ${entityTypeLabel}`,
        action: "convertToJob",
      });
      toast.success("Tap to Pay successful");
      onOpenChange(false);
    } else if (method === "ach") {
      setShowACHModal(true);
    }
  };

  const handlePaymentComplete = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
<<<<<<< HEAD
      <DialogContent className="max-w-md p-0 max-h-[90vh] overflow-y-auto">
=======
      <DialogContent className="max-w-md p-0 max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="sr-only">
          <DialogTitle>Service Pro911 - Payment</DialogTitle>
          <DialogDescription>Process payment for agreement</DialogDescription>
        </DialogHeader>
>>>>>>> 364b4fc (feat: Refactor navigation to sidebar, implement table view for estimates, and add convert to invoice option)
        {/* Header */}
        <div className="bg-orange-500 text-white px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-orange-600 h-7 w-7 sm:h-8 sm:w-8"
            onClick={() => onOpenChange(false)}
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <h2 className="text-base sm:text-lg font-semibold flex-1">Service Pro911 - Payment</h2>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-orange-600 h-7 w-7 sm:h-8 sm:w-8"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>

        <div className="px-3 sm:px-4 py-3 sm:py-4 space-y-2 sm:space-y-3 flex-1 overflow-hidden flex flex-col">
          {/* Total Amount Section */}
          <div className="flex flex-col items-center justify-center py-2 sm:py-3 flex-shrink-0">
            <div className="relative mb-2 sm:mb-3">
              <div className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 rounded-full bg-orange-100 flex items-center justify-center">
                <RefreshCw className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 text-orange-500" />
              </div>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">Total Amount</p>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">${totalAmount.toFixed(2)}</p>
          </div>



          {/* Payment Options Section */}
          <div className="flex-1 flex flex-col min-h-0">
            <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-3 flex-shrink-0">Payment Options</h3>

            {/* Payment Method Cards */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 flex-1 min-h-0">
              {/* Tap to Pay */}
              <Card
                className={`cursor-pointer transition-all hover:shadow-md bg-white flex flex-col ${selectedPaymentMethod === "tap"
                    ? "border-orange-500 border-2 bg-orange-50"
                    : "border-gray-200"
                  }`}
                onClick={() => handlePaymentMethodSelect("tap")}
              >
                <CardContent className="pt-3 sm:pt-4 md:pt-6 pb-2 sm:pb-3 md:pb-4 flex flex-col items-center justify-center flex-1">
                  <div className="mb-1 sm:mb-2 md:mb-3">
                    <Zap className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 text-orange-500" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-center text-foreground">Tap to Pay</p>
                </CardContent>
              </Card>

              {/* Enter Card Manually */}
              <Card
                className={`cursor-pointer transition-all hover:shadow-md bg-white flex flex-col ${selectedPaymentMethod === "card"
                    ? "border-orange-500 border-2 bg-orange-50"
                    : "border-gray-200"
                  }`}
                onClick={() => handlePaymentMethodSelect("card")}
              >
                <CardContent className="pt-3 sm:pt-4 md:pt-6 pb-2 sm:pb-3 md:pb-4 flex flex-col items-center justify-center flex-1">
                  <div className="mb-1 sm:mb-2 md:mb-3">
                    <CreditCard className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 text-orange-500" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-center text-foreground">Enter Card Manually</p>
                </CardContent>
              </Card>

              {/* ACH Payment */}
              <Card
                className={`cursor-pointer transition-all hover:shadow-md bg-white flex flex-col ${selectedPaymentMethod === "ach"
                    ? "border-orange-500 border-2 bg-orange-50"
                    : "border-gray-200"
                  }`}
                onClick={() => handlePaymentMethodSelect("ach")}
              >
                <CardContent className="pt-3 sm:pt-4 md:pt-6 pb-2 sm:pb-3 md:pb-4 flex flex-col items-center justify-center flex-1">
                  <div className="mb-1 sm:mb-2 md:mb-3">
                    <Building2 className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 text-orange-500" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-center text-foreground">ACH Payment</p>
                </CardContent>
              </Card>

              {/* Pay by Cash */}
              <Card
                className={`cursor-pointer transition-all hover:shadow-md bg-white flex flex-col ${selectedPaymentMethod === "cash"
                    ? "border-orange-500 border-2 bg-orange-50"
                    : "border-gray-200"
                  }`}
                onClick={() => handlePaymentMethodSelect("cash")}
              >
                <CardContent className="pt-3 sm:pt-4 md:pt-6 pb-2 sm:pb-3 md:pb-4 flex flex-col items-center justify-center flex-1">
                  <div className="mb-1 sm:mb-2 md:mb-3">
                    <DollarSign className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 text-orange-500" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-center text-foreground">Pay by Cash</p>
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
        entityType="agreement"
        entityId={agreement.id || ""}
      />

      <ACHPaymentModal
        open={showACHModal}
        onOpenChange={setShowACHModal}
        totalAmount={totalAmount}
        onPaymentComplete={handlePaymentComplete}
        entityType="agreement"
        entityId={agreement.id || ""}
      />

      <PayCashModal
        open={showPayCashModal}
        onOpenChange={setShowPayCashModal}
        orderAmount={totalAmount}
        orderId={agreement.id || ""}
        onPaymentComplete={handlePaymentComplete}
        entityType="agreement"
      />
    </Dialog>
  );
};
