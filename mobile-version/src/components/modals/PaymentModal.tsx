import { ArrowLeft, X, Zap, CreditCard, Building2, DollarSign, RotateCcw } from "lucide-react";
import { Dialog, DialogContent, DialogDescription } from "@/components/ui/dialog";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onPaymentMethodSelect?: (method: string) => void;
}

const PaymentModal = ({ isOpen, onClose, amount, onPaymentMethodSelect }: PaymentModalProps) => {
  const paymentOptions = [
    {
      id: "tap-to-pay",
      label: "Tap to Pay",
      icon: Zap,
    },
    {
      id: "enter-card",
      label: "Enter Card Manually",
      icon: CreditCard,
    },
    {
      id: "ach",
      label: "ACH Payment",
      icon: Building2,
    },
    {
      id: "cash",
      label: "Pay by Cash",
      icon: DollarSign,
    },
  ];

  const handlePaymentMethodClick = (methodId: string) => {
    if (onPaymentMethodSelect) {
      onPaymentMethodSelect(methodId);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-[calc(100%-2rem)] p-0 gap-0 rounded-2xl max-h-[85vh] overflow-hidden [&>div]:p-0">
        <DialogDescription className="sr-only">
          Payment modal for amount ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </DialogDescription>
        {/* Orange Header */}
        <div className="bg-orange-500 px-3 py-3 sm:px-4 sm:py-4 flex items-center justify-between safe-top">
          <button
            onClick={onClose}
            className="p-1.5 -ml-1.5 rounded-full hover:bg-orange-600 transition-colors touch-target"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </button>
          <h2 className="text-base sm:text-lg font-semibold text-white px-2 text-center flex-1">Service Pro911 - Payment</h2>
          <button
            onClick={onClose}
            className="p-1.5 -mr-1.5 rounded-full hover:bg-orange-600 transition-colors touch-target"
            aria-label="Close"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="bg-white py-5 sm:py-7 space-y-4 sm:space-y-6 overflow-y-auto safe-bottom overflow-x-hidden">
          {/* Total Amount Section */}
          <div className="flex flex-col items-center space-y-2 sm:space-y-3 px-6 sm:px-8 mt-2 sm:mt-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-orange-100 flex items-center justify-center">
              <RotateCcw className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500" />
            </div>
            <div className="text-center">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Amount</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </div>

          {/* Payment Options */}
          <div className="space-y-3 sm:space-y-4 w-full">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 text-center px-6 sm:px-8">Payment Options</h3>
            <div className="w-full px-10 sm:px-12 pb-6 box-border">
              <div className="grid grid-cols-2 gap-4 sm:gap-5 w-full box-border">
                {paymentOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handlePaymentMethodClick(option.id)}
                      className="flex flex-col items-center justify-center p-4 sm:p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all active:scale-95 touch-target min-h-[100px] sm:min-h-[120px]"
                    >
                      <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500 mb-2 sm:mb-3" />
                      <span className="text-xs sm:text-sm font-medium text-gray-900 text-center leading-tight">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;

