import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Calendar } from "@/components/ui/calendar";
import { 
  ArrowLeft, 
  Edit, 
  Calendar as CalendarIcon,
  FileText,
  ClipboardList,
  FileSignature,
  Upload,
  Save,
  X
} from "lucide-react";
import { mockCustomers, mockJobs } from "@/data/mockData";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [memo, setMemo] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Check if we should start in edit mode from navigation state
  useEffect(() => {
    if (location.state?.editMode) {
      setIsEditing(true);
    }
  }, [location.state]);
  const [editedCustomer, setEditedCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    status: "active",
    gender: "M",
  });

  const customer = mockCustomers.find(c => c.id === id);
  const customerOrders = mockJobs.filter(job => job.customerId === id);

  // Initialize edited customer when customer is loaded
  useState(() => {
    if (customer) {
      setEditedCustomer({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address || "",
        status: customer.status,
        gender: customer.gender || "M",
      });
    }
  });

  const handleSaveEdit = () => {
    // Save logic here
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    if (customer) {
      setEditedCustomer({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address || "",
        status: customer.status,
        gender: customer.gender || "M",
      });
    }
    setIsEditing(false);
  };

  if (!customer) {
    return (
      <div className="flex-1">
        <AppHeader searchPlaceholder="Search..." onSearchChange={() => {}} />
        <main className="px-6 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Customer not found</h1>
            <Button onClick={() => navigate("/customers")} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Customers
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const initials = customer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const filteredOrders = customerOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || order.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <TooltipProvider>
      <div className="flex-1">
        <AppHeader searchPlaceholder="Search..." onSearchChange={() => {}} />

        <main className="px-6 py-6 space-y-6 animate-fade-in">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/customers")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Customer Details</h1>
              <p className="text-muted-foreground">View and manage customer information</p>
            </div>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Details Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Customer Information</CardTitle>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-green-600"
                      onClick={handleSaveEdit}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive"
                      onClick={handleCancelEdit}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Image */}
              <div className="flex flex-col items-center space-y-2">
                <Avatar className="h-24 w-24 border-4 border-primary/20">
                  <AvatarImage src={customer.avatar} alt={customer.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-2xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm" className="gap-2">
                  <Upload className="h-3 w-3" />
                  Upload Photo
                </Button>
              </div>

              {/* Customer Details */}
              <div className="space-y-4 text-sm">
                <div>
                  <label className="text-muted-foreground block mb-1">Name</label>
                  {isEditing ? (
                    <Input
                      value={editedCustomer.name}
                      onChange={(e) => setEditedCustomer({ ...editedCustomer, name: e.target.value })}
                    />
                  ) : (
                    <p className="font-medium text-foreground">{customer.name}</p>
                  )}
                </div>

                <div>
                  <label className="text-muted-foreground block mb-1">Email Address</label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={editedCustomer.email}
                      onChange={(e) => setEditedCustomer({ ...editedCustomer, email: e.target.value })}
                    />
                  ) : (
                    <p className="font-medium text-foreground">{customer.email}</p>
                  )}
                </div>

                <div>
                  <label className="text-muted-foreground block mb-1">Phone Number</label>
                  {isEditing ? (
                    <Input
                      value={editedCustomer.phone}
                      onChange={(e) => setEditedCustomer({ ...editedCustomer, phone: e.target.value })}
                    />
                  ) : (
                    <p className="font-medium text-foreground">{customer.phone}</p>
                  )}
                </div>

                <div>
                  <label className="text-muted-foreground">Company Name</label>
                  <p className="font-medium text-foreground">-</p>
                </div>

                <div>
                  <label className="text-muted-foreground block mb-1">Address</label>
                  {isEditing ? (
                    <Input
                      value={editedCustomer.address}
                      onChange={(e) => setEditedCustomer({ ...editedCustomer, address: e.target.value })}
                    />
                  ) : (
                    <p className="font-medium text-foreground">{customer.address || "-"}</p>
                  )}
                </div>

                <div>
                  <label className="text-muted-foreground block mb-1">Status</label>
                  {isEditing ? (
                    <Select
                      value={editedCustomer.status}
                      onValueChange={(value) => setEditedCustomer({ ...editedCustomer, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="deactivated">Deactivated</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="mt-1">
                      <Badge variant={customer.status === "active" ? "default" : "secondary"}>
                        {customer.status === "active" ? "Active" : "Deactivated"}
                      </Badge>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-muted-foreground block mb-1">Gender</label>
                  {isEditing ? (
                    <Select
                      value={editedCustomer.gender}
                      onValueChange={(value) => setEditedCustomer({ ...editedCustomer, gender: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Male</SelectItem>
                        <SelectItem value="F">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="font-medium text-foreground">
                      {customer.gender === "M" ? "Male" : customer.gender === "F" ? "Female" : "-"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-muted-foreground mb-2 block">Memo</label>
                  <Textarea
                    placeholder="Add a memo about this customer..."
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orders Section */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <CardTitle>Orders</CardTitle>
                <div className="flex gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-9 w-9"
                        onClick={() => navigate("/add-appointment", { state: { preselectedCustomer: customer } })}
                      >
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add Appointment</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-9 w-9"
                        onClick={() => navigate("/estimates", { state: { preselectedCustomer: customer } })}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Create Estimate</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-9 w-9"
                        onClick={() => navigate("/invoices", { state: { preselectedCustomer: customer } })}
                      >
                        <ClipboardList className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Create Invoice</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-9 w-9"
                        onClick={() => navigate("/agreements", { state: { preselectedCustomer: customer } })}
                      >
                        <FileSignature className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Create Agreement</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {/* Filters */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Type filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="invoice">Invoices</SelectItem>
                    <SelectItem value="estimate">Estimates</SelectItem>
                    <SelectItem value="agreement">Agreements</SelectItem>
                  </SelectContent>
                </Select>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd")} - {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        "Date range"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={(range) => setDateRange(range as any)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Employee Name</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.assignedTo}</TableCell>
                        <TableCell>${order.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {order.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{format(new Date(order.scheduledDate), "MMM dd, yyyy")}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No orders found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
    </TooltipProvider>
  );
};

export default CustomerDetails;
