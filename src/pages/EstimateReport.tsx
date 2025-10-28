import { useState } from "react";
import { ChevronLeft, Info, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock data for Estimate Report
const estimateData = [
  { date: "10/01/2025", orderId: "5707664952982", customerName: "gabe saz", employeeName: "Harry Potter", amount: "$13.50", status: "Open" },
  { date: "09/17/2025", orderId: "1571514281876", customerName: "vishal patel", employeeName: "bruce wayne", amount: "$12.06", status: "Paid" },
  { date: "09/17/2025", orderId: "1496912420351", customerName: "vishal patel", employeeName: "bruce wayne", amount: "$12.06", status: "Paid" },
  { date: "08/28/2025", orderId: "8741678877441", customerName: "vishal patel", employeeName: "bruce wayne", amount: "$316.66", status: "Paid" },
  { date: "08/27/2025", orderId: "3484048724010", customerName: "vishal patel", employeeName: "bruce wayne", amount: "$20.00", status: "Paid" },
  { date: "08/26/2025", orderId: "2243242736713", customerName: "vishal patel", employeeName: "bruce wayne", amount: "$24.12", status: "Open" },
  { date: "08/26/2025", orderId: "3078458785481", customerName: "vishal patel", employeeName: "bruce wayne", amount: "$24.12", status: "Open" },
  { date: "08/26/2025", orderId: "9265704801596", customerName: "vishal patel", employeeName: "bruce wayne", amount: "$240.04", status: "Open" },
  { date: "08/26/2025", orderId: "2218219726143", customerName: "vishal patel", employeeName: "bruce wayne", amount: "$14.12", status: "Open" },
];

const EstimateReport = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [days, setDays] = useState("all");
  const [employee, setEmployee] = useState("all");

  const handleClearFilters = () => {
    setSearch("");
    setStatus("all");
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
            <h1 className="text-2xl font-bold">Service Pro911 - Estimate Reports</h1>
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
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
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
                <SelectItem value="harry">Harry Potter</SelectItem>
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

        {/* Estimate Table */}
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {estimateData.map((estimate, index) => (
                <TableRow key={index}>
                  <TableCell className="text-muted-foreground">{estimate.date}</TableCell>
                  <TableCell className="text-muted-foreground">{estimate.orderId}</TableCell>
                  <TableCell className="text-primary font-medium">{estimate.customerName}</TableCell>
                  <TableCell className="text-primary font-medium">{estimate.employeeName}</TableCell>
                  <TableCell className="text-primary font-semibold">{estimate.amount}</TableCell>
                  <TableCell>
                    <span className={estimate.status === "Paid" ? "text-success font-semibold" : "text-info font-semibold"}>
                      {estimate.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default EstimateReport;
