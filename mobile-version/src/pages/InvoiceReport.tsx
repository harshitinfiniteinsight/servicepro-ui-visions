import { useState } from "react";
import MobileHeader from "@/components/layout/MobileHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockInvoices } from "@/data/mobileMockData";
import { Download, DollarSign, FileText, TrendingUp } from "lucide-react";

const InvoiceReport = () => {
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-01-31");

  const filteredInvoices = mockInvoices.filter(inv => {
    const invDate = new Date(inv.issueDate);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return invDate >= start && invDate <= end;
  });

  const summary = {
    total: filteredInvoices.length,
    paid: filteredInvoices.filter(i => i.status === "Paid").length,
    open: filteredInvoices.filter(i => i.status === "Open").length,
    overdue: filteredInvoices.filter(i => i.status === "Overdue").length,
    totalRevenue: filteredInvoices.filter(i => i.status === "Paid").reduce((sum, i) => sum + i.amount, 0),
    totalOutstanding: filteredInvoices.filter(i => i.status !== "Paid").reduce((sum, i) => sum + i.amount, 0),
  };

  // Mock chart data (simple bar representation)
  const chartData = [
    { label: "Paid", value: summary.paid, color: "bg-success" },
    { label: "Open", value: summary.open, color: "bg-warning" },
    { label: "Overdue", value: summary.overdue, color: "bg-destructive" },
  ];
  const maxValue = Math.max(...chartData.map(d => d.value), 1);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <MobileHeader title="Invoice Report" showBack={true} />
      
      <div className="flex-1 overflow-y-auto scrollable pt-14 px-4 pb-6 space-y-4">
        {/* Date Range */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Start Date</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <Label>End Date</Label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium">Total Invoices</span>
            </div>
            <p className="text-2xl font-bold">{summary.total}</p>
          </div>
          <div className="p-4 rounded-xl bg-success/5 border border-success/20">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-success" />
              <span className="text-xs font-medium">Revenue</span>
            </div>
            <p className="text-xl font-bold">${summary.totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="p-4 rounded-xl border bg-card">
          <h3 className="font-semibold mb-4">Status Breakdown</h3>
          <div className="space-y-3">
            {chartData.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-sm font-bold">{item.value}</span>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full ${item.color} transition-all`}
                    style={{ width: `${(item.value / maxValue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-warning/5 border border-warning/20">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-warning" />
              <span className="text-xs font-medium">Outstanding</span>
            </div>
            <p className="text-xl font-bold">${summary.totalOutstanding.toLocaleString()}</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/50 border">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Paid Rate</span>
            </div>
            <p className="text-xl font-bold">
              {summary.total > 0 ? Math.round((summary.paid / summary.total) * 100) : 0}%
            </p>
          </div>
        </div>

        {/* Export Button */}
        <Button className="w-full" size="lg">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>
    </div>
  );
};

export default InvoiceReport;
