import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { mockCustomers } from "@/data/mockData";

interface AgreementPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agreement: any;
}

export const AgreementPaymentModal = ({ open, onOpenChange, agreement }: AgreementPaymentModalProps) => {
  const [selectedAgreements, setSelectedAgreements] = useState([agreement?.id]);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [validThru, setValidThru] = useState("");
  const [cvv, setCvv] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [authorized, setAuthorized] = useState(false);

  if (!agreement) return null;

  const customer = mockCustomers.find(c => c.id === agreement.customerId);

  const toggleAgreementSelection = (agreementId: string) => {
    setSelectedAgreements(prev => 
      prev.includes(agreementId) 
        ? prev.filter(id => id !== agreementId)
        : [...prev, agreementId]
    );
  };

  const handlePayNow = () => {
    if (!authorized) {
      toast.error("Please authorize the payment");
      return;
    }
    if (!cardNumber || !cardName || !validThru || !cvv || !zipCode) {
      toast.error("Please fill in all card details");
      return;
    }
    toast.success("Payment processed successfully");
    onOpenChange(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  const grossAmount = agreement?.amount || 0;
  const previousBalance = 0;
  const couponDiscount = 0;
  const payableAmount = grossAmount + previousBalance - couponDiscount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
        <div className="sticky top-0 bg-background border-b z-10 px-6 py-4">
          <h2 className="text-2xl font-semibold text-center">Payment Due</h2>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left section - Agreement details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer message */}
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-muted-foreground">
                        Dear <span className="text-foreground font-medium">{customer?.name || agreement.customerName || "Customer"}</span>,
                      </p>
                      <p className="text-sm text-muted-foreground">
                        We appreciate your prompt payment. Please complete the payment form below. Thanks for your business.
                      </p>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-muted-foreground">From:</span> <span className="font-medium">Service Pro</span></p>
                      <p><span className="text-muted-foreground">Email:</span> admin@universalstore.xyz</p>
                      <p><span className="text-muted-foreground">Phone:</span> (406) 262-7649</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Agreement table */}
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50 border-b">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">
                            <Checkbox 
                              checked={selectedAgreements.includes(agreement.id)}
                              onCheckedChange={() => toggleAgreementSelection(agreement.id)}
                            />
                          </th>
                          <th className="px-4 py-3 text-left font-semibold">Agreement ID</th>
                          <th className="px-4 py-3 text-left font-semibold">Agreement Date</th>
                          <th className="px-4 py-3 text-left font-semibold">Agreement Amount</th>
                          <th className="px-4 py-3 text-left font-semibold">Balance Due</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b hover:bg-muted/30">
                          <td className="px-4 py-3">
                            <Checkbox 
                              checked={selectedAgreements.includes(agreement.id)}
                              onCheckedChange={() => toggleAgreementSelection(agreement.id)}
                            />
                          </td>
                          <td className="px-4 py-3 font-mono text-sm">{agreement.id}</td>
                          <td className="px-4 py-3">{formatDate(agreement.startDate)}</td>
                          <td className="px-4 py-3 font-semibold">${(agreement.amount || 0).toFixed(2)}</td>
                          <td className="px-4 py-3 font-semibold">${(agreement.amount || 0).toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Mode */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-6">Choose Payment Mode</h3>
                  
                  <div className="flex items-center gap-3 mb-6 pb-4 border-l-4 border-primary pl-4">
                    <div className="h-5 w-5 rounded border-2 border-primary"></div>
                    <span className="text-primary font-medium">Credit/Debit Card</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Card Number</label>
                      <Input
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        maxLength={19}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Name on Card</label>
                      <Input
                        placeholder="Enter Name on Card"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Valid Thru</label>
                        <Input
                          placeholder="00 / 00"
                          value={validThru}
                          onChange={(e) => setValidThru(e.target.value)}
                          maxLength={7}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">CVV</label>
                        <Input
                          type="password"
                          placeholder="***"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          maxLength={4}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Zip</label>
                      <Input
                        placeholder="Zip Code"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                      />
                    </div>

                    <div className="flex items-start gap-2 mt-6">
                      <Checkbox
                        id="authorize"
                        checked={authorized}
                        onCheckedChange={(checked) => setAuthorized(checked as boolean)}
                      />
                      <label htmlFor="authorize" className="text-sm leading-tight cursor-pointer">
                        I authorize this payment and confirm the above card details are correct.
                      </label>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
                        View Agreement
                      </Button>
                      <Button 
                        className="flex-1 bg-[#FF4D00] hover:bg-[#E64500] text-white"
                        onClick={handlePayNow}
                      >
                        Pay Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment logos */}
              <div className="flex items-center justify-between py-4">
                <div className="flex gap-3">
                  <div className="h-10 w-14 bg-[#1A1F71] rounded flex items-center justify-center text-white text-xs font-bold">VISA</div>
                  <div className="h-10 w-14 bg-gradient-to-br from-[#EB001B] to-[#F79E1B] rounded flex items-center justify-center">
                    <div className="flex">
                      <div className="h-6 w-6 rounded-full bg-[#EB001B]"></div>
                      <div className="h-6 w-6 rounded-full bg-[#F79E1B] -ml-3"></div>
                    </div>
                  </div>
                  <div className="h-10 w-14 bg-[#006FCF] rounded flex items-center justify-center">
                    <div className="text-white text-[10px] font-bold">AmEx</div>
                  </div>
                  <div className="h-10 w-14 bg-gradient-to-br from-[#FF6000] to-[#FFA500] rounded flex items-center justify-center text-white text-[10px] font-bold">DISCOVER</div>
                  <div className="h-10 w-14 bg-gradient-to-br from-purple-600 to-purple-800 rounded flex items-center justify-center text-white text-[10px] font-bold">Pay</div>
                </div>

                <div className="text-sm">
                  Powered By <span className="text-[#FF4D00] font-semibold">Universell</span>
                </div>
              </div>

              <div className="flex gap-4 text-sm text-muted-foreground">
                <button className="hover:underline">Terms and Condition</button>
                <button className="hover:underline">Cancellation Policy</button>
              </div>
            </div>

            {/* Right section - Price details */}
            <div>
              <Card className="sticky top-24">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-6">Price Details</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Gross Amount:</span>
                      <span className="font-semibold">$ {grossAmount.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-medium">Previous Balance Due:</span>
                      <span className="font-semibold">$ {previousBalance.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-medium">Coupon Discount: $</span>
                      <span className="font-semibold">{couponDiscount}</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-lg font-semibold">Payable Amount :</span>
                      <span className="text-lg font-bold text-primary">$ {payableAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

