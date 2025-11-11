import { useMemo } from "react";
import { Dialog, DialogContent, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Printer, X, Mail, MessageSquare, UserCog } from "lucide-react";
import { format } from "date-fns";
import { mockCustomers } from "@/data/mobileMockData";
import { cn } from "@/lib/utils";

interface InvoiceItem {
  serviceDate: string;
  productService: string;
  sku: string;
  description: string;
  qty: number;
  rate: number;
  discount: number;
  subTotal: number;
  tax: number;
}

interface PreviewInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: {
    id: string;
    customerId: string;
    customerName: string;
    issueDate: string;
    dueDate: string;
    amount: number;
    status: string;
    paymentMethod: string;
    items?: InvoiceItem[];
  };
  onAction?: (action: string) => void;
}

const PreviewInvoiceModal = ({ isOpen, onClose, invoice, onAction }: PreviewInvoiceModalProps) => {
  const customer = useMemo(() => mockCustomers.find(c => c.id === invoice.customerId), [invoice.customerId]);

  const invoiceDate = invoice.issueDate ? format(new Date(invoice.issueDate), "MM/dd/yyyy") : "09/12/2024";
  const dueDate = invoice.dueDate ? format(new Date(invoice.dueDate), "MM/dd/yyyy") : "09/12/2024";
  const terms = "Due On Receipt";

  const items: InvoiceItem[] = invoice.items || [
    {
      serviceDate: "09/12/2024",
      productService: "Ceiling fan installation",
      sku: "N/A",
      description: "Ceiling fan installation",
      qty: 1,
      rate: 500,
      discount: 0,
      subTotal: 500,
      tax: 0,
    },
    {
      serviceDate: "09/12/2024",
      productService: "Ceiling fan unit",
      sku: "N/A",
      description: "Ceiling fan unit",
      qty: 1,
      rate: 180,
      discount: 0,
      subTotal: 180,
      tax: 0,
    },
  ];

  const itemTotal = items.reduce((sum, item) => sum + item.subTotal, 0);
  const totalDiscount = items.reduce((sum, item) => sum + (item.subTotal * item.discount / 100), 0);
  const subtotalAfterDiscount = itemTotal - totalDiscount;
  const totalTax = items.reduce((sum, item) => sum + item.tax, 0);
  const invoiceTotal = subtotalAfterDiscount + totalTax;
  const balanceDue = invoice.status === "Paid" ? 0 : invoiceTotal;

  const handleAction = (action: string) => {
    onAction?.(action);
    if (action === "close") {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!fixed !inset-0 !translate-x-0 !translate-y-0 m-0 flex h-full max-h-full w-full max-w-full flex-col gap-0 rounded-none p-0 sm:!left-1/2 sm:!top-1/2 sm:h-auto sm:max-h-[92vh] sm:w-[720px] sm:!translate-x-[-50%] sm:!translate-y-[-50%] sm:rounded-3xl">
        <DialogDescription className="sr-only">Preview invoice {invoice.id}</DialogDescription>

        <div className="bg-[#0E5FFF] px-4 py-4 flex items-center justify-between safe-top">
          <h2 className="text-lg font-semibold text-white">Preview Invoice</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAction("print")}
              className="text-white hover:bg-white/20 h-9 px-3"
            >
              <Printer className="h-4 w-4 mr-1.5" />
              <span className="text-sm">Printer</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20 h-9 w-9 p-0"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#0A1C2F]">
          <div className="mx-auto w-full max-w-[900px] px-4 py-6">
            <div className="rounded-3xl bg-white shadow-2xl overflow-hidden border border-gray-100">
              <div className="bg-[#0E5FFF] text-white px-6 py-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide opacity-80">Invoice No.</p>
                  <p className="text-lg font-semibold">{invoice.id}</p>
                </div>
                <div className="flex gap-6 text-sm">
                  <div>
                    <p className="text-xs uppercase tracking-wide opacity-80">Invoice Date</p>
                    <p className="font-semibold">{invoiceDate}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide opacity-80">Terms</p>
                    <p className="font-semibold">{terms}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide opacity-80">Due Date</p>
                    <p className="font-semibold">{dueDate}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-6 py-5 bg-[#F5F8FF] border-b border-[#E0E7FF]">
                <div>
                  <p className="text-xs font-semibold text-[#0E1E3E] uppercase mb-2">Bill To</p>
                  <div className="space-y-1 text-xs text-[#1D3A6B]">
                    <p className="font-semibold">{customer?.name || invoice.customerName}</p>
                    <p>{customer?.email || "info@email.com"}</p>
                    <p>{customer?.address || "789 Pine Rd, Cambridge, MA 02140"}</p>
                    <p>{customer?.phone || "(555) 345-6789"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#0E1E3E] uppercase mb-2">Ship To</p>
                  <div className="space-y-1 text-xs text-[#1D3A6B]">
                    <p className="font-semibold">{customer?.name || invoice.customerName}</p>
                    <p>{customer?.email || "info@email.com"}</p>
                    <p>{customer?.address || "456 Oak Ave, Brooklyn, NY 11201"}</p>
                    <p>{customer?.phone || "(555) 345-6789"}</p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-5 space-y-4 bg-white">
                <div className="space-y-3 sm:hidden">
                  {items.map((item, index) => (
                    <div key={index} className="rounded-2xl border border-gray-200 bg-white px-3 py-3 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{item.productService}</p>
                          <p className="text-[11px] text-gray-500">{item.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-[#FF8A3C]">${item.subTotal.toFixed(2)}</p>
                          <p className="text-[11px] text-gray-500">Sub Total</p>
                        </div>
                      </div>
                      <div className="mt-3 space-y-2 text-[11px] text-gray-600">
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <p className="font-medium text-gray-800">Service Date</p>
                            <p>{item.serviceDate}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">SKU</p>
                            <p>{item.sku}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">Qty</p>
                            <p>{item.qty}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <p className="font-medium text-gray-800">Rate</p>
                            <p>${item.rate.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">Discount</p>
                            <p>{item.discount.toFixed(2)}%</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">Tax</p>
                            <p>${item.tax.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-xs border border-[#E0E7FF]">
                    <thead>
                      <tr className="bg-[#0E5FFF] text-white">
                        <th className="px-3 py-2 text-left font-semibold">Service Date</th>
                        <th className="px-3 py-2 text-left font-semibold">Product/Service</th>
                        <th className="px-3 py-2 text-left font-semibold">SKU</th>
                        <th className="px-3 py-2 text-left font-semibold">Description</th>
                        <th className="px-3 py-2 text-center font-semibold">QTY</th>
                        <th className="px-3 py-2 text-right font-semibold">Rate</th>
                        <th className="px-3 py-2 text-right font-semibold">Discount</th>
                        <th className="px-3 py-2 text-right font-semibold">Sub Total</th>
                        <th className="px-3 py-2 text-right font-semibold">Tax</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr key={index} className="border-b border-[#E0E7FF]">
                          <td className="px-3 py-2">{item.serviceDate}</td>
                          <td className="px-3 py-2">{item.productService}</td>
                          <td className="px-3 py-2">{item.sku}</td>
                          <td className="px-3 py-2">{item.description}</td>
                          <td className="px-3 py-2 text-center">{item.qty}</td>
                          <td className="px-3 py-2 text-right">${item.rate.toFixed(2)}</td>
                          <td className="px-3 py-2 text-right">{item.discount.toFixed(2)}%</td>
                          <td className="px-3 py-2 text-right">${item.subTotal.toFixed(2)}</td>
                          <td className="px-3 py-2 text-right">${item.tax.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2 text-sm text-[#1D3A6B]">
                    <p>
                      <span className="font-semibold text-[#0E1E3E]">Message on Invoice:</span> –
                    </p>
                    <p>
                      <span className="font-semibold text-[#0E1E3E]">Terms & Conditions:</span>{" "}
                      <span className="text-[#0E5FFF]">from global settings</span>
                    </p>
                    <p>
                      <span className="font-semibold text-[#0E1E3E]">Cancellation & Refund Policy:</span> –
                    </p>
                    <p className="pt-2 font-semibold text-[#0E1E3E]">Thank You For Your Business!</p>
                    <p className="text-xs">
                      If below ‘Pay Now’ button didn’t work, just copy and paste this URL into your web browser’s address bar to complete payment:
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#F8FBFF] border border-[#E0E7FF] px-4 py-4 space-y-2 text-sm text-[#0E1E3E]">
                    <div className="flex justify-between">
                      <span>Item Total</span>
                      <span className="font-medium">${itemTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sub Total after Discount</span>
                      <span className="font-medium">${subtotalAfterDiscount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes</span>
                      <span className="font-medium">${totalTax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t border-[#E0E7FF] pt-2">
                      <span className="font-semibold text-base">Invoice Total</span>
                      <span className="font-semibold text-base">${invoiceTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Invoice Balance due</span>
                      <span className="font-medium">${balanceDue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Balance due</span>
                      <span className="font-medium">${balanceDue.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                  {invoice.status !== "Paid" ? (
                    <Button
                      onClick={() => handleAction("pay-now")}
                      className="bg-[#FF8A3C] hover:bg-[#ff7a1f] text-white font-semibold px-6 py-2 rounded-full"
                    >
                      Pay Now
                    </Button>
                  ) : (
                    <div className="border-2 border-green-500 text-green-600 px-4 py-1 rounded-lg inline-flex items-center gap-1 bg-green-50">
                      <span className="text-sm font-semibold">Paid</span>
                    </div>
                  )}

                  <div
                    className={cn(
                      "px-4 py-1.5 rounded-md border-2 uppercase tracking-[4px] text-sm font-semibold inline-flex items-center",
                      invoice.status === "Paid"
                        ? "border-green-500 text-green-600 bg-green-50"
                        : "border-red-500 text-red-500 bg-red-50"
                    )}
                  >
                    {invoice.status === "Open" ? "Unpaid" : invoice.status}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0E5FFF] px-4 py-3 flex items-center gap-2 overflow-x-auto safe-bottom">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAction("send-email")}
            className="text-white hover:bg-white/20 flex-shrink-0"
          >
            <Mail className="h-4 w-4 mr-1.5" />
            <span className="text-xs">Send Email</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAction("send-sms")}
            className="text-white hover:bg-white/20 flex-shrink-0"
          >
            <MessageSquare className="h-4 w-4 mr-1.5" />
            <span className="text-xs">Send via SMS</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAction("reassign")}
            className="text-white hover:bg-white/20 flex-shrink-0"
          >
            <UserCog className="h-4 w-4 mr-1.5" />
            <span className="text-xs">Reassign Employee</span>
          </Button>
          <div className="flex-1" />
          <Button
            onClick={onClose}
            className="bg-white text-[#0E5FFF] hover:bg-white/90 flex-shrink-0"
            size="sm"
          >
            <span className="text-xs font-semibold">Close</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewInvoiceModal;

