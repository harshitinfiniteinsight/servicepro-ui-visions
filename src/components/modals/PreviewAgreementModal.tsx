import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileDown, X, CheckCircle, Send, Eye, PenTool, Lock, Camera, User } from "lucide-react";
import { mockCustomers, mockEmployees } from "@/data/mockData";

interface PreviewAgreementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agreement: any;
  onPayNow?: (agreement: any) => void;
}

export const PreviewAgreementModal = ({ open, onOpenChange, agreement, onPayNow }: PreviewAgreementModalProps) => {
  if (!agreement) return null;

  // Find customer and employee details
  const customer = mockCustomers.find(c => c.id === agreement.customerId);
  const employee = mockEmployees.find(e => e.id === agreement.employeeId);

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  // Format terms
  const formatTerms = (terms: string) => {
    if (!terms) return "due on receipt";
    return terms.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // PDF download logic would go here
    console.log("Downloading PDF...");
  };

  // Mock audit trail data
  const auditTrail = [
    {
      trail: "Document Created",
      user: "Merchant Name (merchant@gmail.com)",
      time: "30 Jan 2023 04:28:08 UTC",
      location: "IP: 192.168.1.1",
      icon: CheckCircle,
    },
    {
      trail: "Document Sent",
      user: "Merchant Name (merchant@gmail.com)",
      time: "30 Jan 2023 04:28:08 UTC",
      location: "IP: 192.168.1.1",
      icon: Send,
    },
    {
      trail: "Document Viewed",
      user: `${customer?.name || agreement.customerName} (${customer?.email || agreement.customerEmail})`,
      time: "30 Jan 2023 04:28:08 UTC",
      location: "IP: 192.168.1.2",
      icon: Eye,
    },
    {
      trail: "Document Signed",
      user: `${customer?.name || agreement.customerName} (${customer?.email || agreement.customerEmail})`,
      time: "30 Jan 2023 04:28:08 UTC",
      location: "IP: 192.168.1.2",
      icon: PenTool,
    },
    {
      trail: "Document Sealed",
      user: `${customer?.name || agreement.customerName} (${customer?.email || agreement.customerEmail})`,
      time: "30 Jan 2023 04:28:08 UTC",
      location: "IP: 192.168.1.2",
      icon: Lock,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0 bg-white">
        <div className="bg-white">
          {/* Header - Blue Banner */}
          <div className="bg-blue-600 text-white p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                {/* Logo */}
                <div className="h-16 w-16 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-3xl font-bold">U</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">UNIVERSELL Store</h1>
                  <div className="space-y-1 text-sm">
                    <p>Business Hub, Miami Street, Miami, Florida.</p>
                    <p>Email: admin@universalstore.xyz</p>
                    <p>Phone: (406) 262-7649</p>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="text-white hover:bg-blue-700 h-10 w-10 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Service Work Order Section */}
            <div className="bg-blue-100 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">Service Work Order</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Customer Name</p>
                  <p className="font-semibold text-gray-900">{customer?.name || agreement.customerName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Employee Name</p>
                  <p className="font-semibold text-gray-900">{employee?.name || agreement.employeeName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Agreement Date</p>
                  <p className="font-semibold text-gray-900">{formatDate(agreement.startDate)}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Payment Terms</p>
                  <p className="font-semibold text-gray-900">{formatTerms(agreement.paymentTerms || "due on receipt")}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Start Date</p>
                  <p className="font-semibold text-gray-900">{formatDate(agreement.startDate)}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">End Date</p>
                  <p className="font-semibold text-gray-900">{formatDate(agreement.endDate)}</p>
                </div>
              </div>
            </div>

            {/* Agreement Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Agreement Description</h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-700">{agreement.terms || agreement.description || "Enter Description"}</p>
              </div>
            </div>

            {/* Service and Amount Table */}
            <div className="flex gap-6">
              <div className="flex-1">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-blue-600 text-white">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Service</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      <tr className="border-b border-gray-100">
                        <td className="px-4 py-3 text-sm text-gray-900">{agreement.title || "Service"}</td>
                        <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">${(agreement.amount || 0).toFixed(2)}</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">Total</td>
                        <td className="px-4 py-3 text-sm text-right font-bold text-gray-900">${(agreement.amount || 0).toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleDownloadPDF}
                  className="bg-blue-600 hover:bg-blue-700 text-white min-w-[180px]"
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  PDF DOWNLOAD
                </Button>
                {agreement.status !== "Paid" && onPayNow && (
                  <Button
                    onClick={() => {
                      if (onPayNow) {
                        onPayNow(agreement);
                        onOpenChange(false);
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white min-w-[180px]"
                  >
                    PAY NOW
                  </Button>
                )}
              </div>
            </div>

            {/* Signature, Photo ID, Snapshot Placeholders */}
            <div className="grid grid-cols-3 gap-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <PenTool className="h-12 w-12 mx-auto mb-2 text-blue-600" />
                <p className="text-sm font-medium text-gray-700">Signature</p>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <User className="h-12 w-12 mx-auto mb-2 text-blue-600" />
                <p className="text-sm font-medium text-gray-700">Photo ID</p>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Camera className="h-12 w-12 mx-auto mb-2 text-blue-600" />
                <p className="text-sm font-medium text-gray-700">Snapshot</p>
              </div>
            </div>

            {/* Audit Trail Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Trail</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Trail</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">User</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Time & Location</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {auditTrail.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-blue-600" />
                              <span className="text-sm text-gray-900">{item.trail}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">{item.user}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {item.time}
                            <br />
                            <span className="text-xs text-gray-500">{item.location}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-blue-600 text-white p-4 rounded-lg">
              <div className="flex items-center justify-center gap-2">
                <div className="h-8 w-8 bg-white rounded flex items-center justify-center">
                  <span className="text-blue-600 text-lg font-bold">U</span>
                </div>
                <p className="text-sm font-medium">Powered by UNIVERSELL</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

