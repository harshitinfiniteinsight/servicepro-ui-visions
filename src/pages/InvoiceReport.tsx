import { useState } from "react";
import { ChevronLeft, Info, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock data for Invoice Report
const invoiceData = [
  { date: "10/24/2025", orderId: "9978338373896", customerName: "katya test", employeeName: "bruce wayne", amount: "$2.06", status: "PAID", paymentType: "Recurring" },
  { date: "10/24/2025", orderId: "8799825287606", customerName: "A B", employeeName: "bruce wayne", amount: "$2.06", status: "OPEN", paymentType: "Recurring" },
  { date: "10/15/2025", orderId: "9536466904438", customerName: "bruce wayne", employeeName: "bruce wayne", amount: "$0.06", status: "OPEN", paymentType: "Single" },
  { date: "09/22/2025", orderId: "3697805008499", customerName: "vishal patel", employeeName: "bruce wayne", amount: "$12.06", status: "PAID", paymentType: "Single" },
  { date: "09/18/2025", orderId: "9621906408954", customerName: "vishal patel", employeeName: "bruce wayne", amount: "$48.24", status: "PAID", paymentType: "Single" },
  { date: "09/17/2025", orderId: "9346558163253", customerName: "vishal patel", employeeName: "bruce wayne", amount: "$12.06", status: "PAID", paymentType: "Single" },
  { date: "09/16/2025", orderId: "9011627707399", customerName: "vishal patel", employeeName: "bruce wayne", amount: "$12.06", status: "PAID", paymentType: "Single" },
  { date: "09/15/2025", orderId: "9053609884832", customerName: "vishal patel", employeeName: "bruce wayne", amount: "$12.06", status: "PAID", paymentType: "Single" },
  { date: "09/15/2025", orderId: "7968990451967", customerName: "vishal patel", employeeName: "bruce wayne", amount: "$24.11", status: "PAID", paymentType: "Single" },
  { date: "09/15/2025", orderId: "6119593851441", customerName: "vishal patel", employeeName: "bruce wayne", amount: "$12.06", status: "PAID", paymentType: "Single" },
  { date: "09/15/2025", orderId: "9017548793690", customerName: "vishal patel", employeeName: "bruce wayne", amount: "$12.06", status: "PAID", paymentType: "Single" },
  { date: "09/12/2025", orderId: "8379944472901", customerName: "vishal patel", employeeName: "bruce wayne", amount: "$0.01", status: "PAID", paymentType: "Single" },
  { date: "08/28/2025", orderId: "2455083442206", customerName: "vishal patel", employeeName: "bruce wayne", amount: "$12.06", status: "PAID", paymentType: "Single" },
  { date: "08/27/2025", orderId: "9880176649526", customerName: "vishal patel", employeeName: "bruce wayne", amount: "$2.06", status: "PAID", paymentType: "Single" },
];

const InvoiceReport = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [paymentType, setPaymentType] = useState("all");
  const [days, setDays] = useState("all");
  const [employee, setEmployee] = useState("all");

  const handleClearFilters = () => {
    setSearch("");
    setStatus("all");
    setPaymentType("all");
    setDays("all");
    setEmployee("all");
  };

  return (
    <div className="flex-1 min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/reports")}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-bold">Service Pro911 - Invoiced Reports</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <Info className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold"
            >
              DATE RANGE
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 bg-background">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">Date : 08/01/2025 TO 10/27/2025</p>
          <div className="flex-1 max-w-2xl mx-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="paid">PAID</SelectItem>
                <SelectItem value="open">OPEN</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Payment Type</label>
            <Select value={paymentType} onValueChange={setPaymentType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="recurring">Recurring</SelectItem>
                <SelectItem value="single">Single</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Days</label>
            <Select value={days} onValueChange={setDays}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Employee</label>
            <Select value={employee} onValueChange={setEmployee}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="bruce">bruce wayne</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-transparent">.</label>
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="gap-2"
            >
              Clear Filter
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="border rounded-lg overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">OrderID</TableHead>
                <TableHead className="font-semibold">Customer Name</TableHead>
                <TableHead className="font-semibold">Employee Name</TableHead>
                <TableHead className="font-semibold">Order Amount</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Payment Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoiceData.map((invoice, index) => (
                <TableRow key={index}>
                  <TableCell className="text-muted-foreground">{invoice.date}</TableCell>
                  <TableCell className="text-muted-foreground">{invoice.orderId}</TableCell>
                  <TableCell className="text-primary font-medium">{invoice.customerName}</TableCell>
                  <TableCell className="text-primary font-medium">{invoice.employeeName}</TableCell>
                  <TableCell className="text-primary font-semibold">{invoice.amount}</TableCell>
                  <TableCell>
                    <span className={invoice.status === "PAID" ? "text-success font-semibold" : "text-warning font-semibold"}>
                      {invoice.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{invoice.paymentType}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default InvoiceReport;
