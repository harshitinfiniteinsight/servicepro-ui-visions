import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MobileHeader from "@/components/layout/MobileHeader";
import { mockCustomers, mockInvoices } from "@/data/mobileMockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Mail, MapPin, DollarSign, Calendar, Edit, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { statusColors } from "@/data/mobileMockData";

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const customer = mockCustomers.find(c => c.id === id);
  
  if (!customer) {
    return (
      <div className="h-full flex items-center justify-center">
        <p>Customer not found</p>
      </div>
    );
  }

  const customerInvoices = mockInvoices.filter(i => i.customerId === id);
  const initials = customer.name.split(" ").map(n => n[0]).join("");
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState({
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    company: customer.notes ?? "",
    address: customer.address,
  });

  const handleChange = (field: keyof typeof formState) => (value: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <MobileHeader 
        title="Customer Details"
        showBack={true}
      />
      
      <div className="flex-1 overflow-y-auto scrollable pt-14 pb-6 space-y-6 px-4">
        {/* Customer Information */}
        <Card className="rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <CardHeader className="flex flex-col gap-4 pt-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">{initials}</span>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Camera className="h-4 w-4" />
                  Upload Photo
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(prev => !prev)}
                className="h-9 w-9"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-xs uppercase font-semibold text-muted-foreground">Name</p>
                  {isEditing ? (
                    <Input
                      value={formState.name}
                      onChange={e => handleChange("name")(e.target.value)}
                    />
                  ) : (
                    <p className="text-lg font-semibold text-gray-900">{formState.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-xs uppercase font-semibold text-muted-foreground">Email Address</p>
                  {isEditing ? (
                    <Input
                      value={formState.email}
                      onChange={e => handleChange("email")(e.target.value)}
                    />
                  ) : (
                    <p className="text-sm text-gray-700">{formState.email}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-xs uppercase font-semibold text-muted-foreground">Phone Number</p>
                  {isEditing ? (
                    <Input
                      value={formState.phone}
                      onChange={e => handleChange("phone")(e.target.value)}
                    />
                  ) : (
                    <p className="text-sm text-gray-700">{formState.phone}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-xs uppercase font-semibold text-muted-foreground">Company Name</p>
                  {isEditing ? (
                    <Input
                      value={formState.company}
                      onChange={e => handleChange("company")(e.target.value)}
                    />
                  ) : (
                    <p className="text-sm text-gray-700">{formState.company || "-"}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs uppercase font-semibold text-muted-foreground">Address</p>
                {isEditing ? (
                  <Textarea
                    value={formState.address}
                    onChange={e => handleChange("address")(e.target.value)}
                    className="min-h-[80px]"
                  />
                ) : (
                  <p className="text-sm text-gray-700 whitespace-pre-line">{formState.address}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-xs uppercase font-semibold text-muted-foreground">Status</p>
                  <Badge className={cn("mt-1", statusColors[customer.status])}>
                    {customer.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs uppercase font-semibold text-muted-foreground">Joined</p>
                  <p className="text-sm text-gray-700">{new Date(customer.joinedDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <p className="text-xs uppercase font-semibold text-muted-foreground">Total Spent</p>
                <p className="text-sm font-semibold text-gray-900">
                  ${customer.totalSpent.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs uppercase font-semibold text-muted-foreground">Memo</p>
              <div className="relative">
                <Textarea
                  placeholder="Add a memo about this customer..."
                  className="min-h-[120px] pr-12"
                  disabled={!isEditing}
                  value={formState.company}
                  onChange={e => handleChange("company")(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute bottom-3 right-3 h-9 w-9 rounded-full hover:bg-muted"
                  onClick={() => isEditing && toast.info("Upload feature coming soon")}
                  disabled={!isEditing}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {isEditing && (
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFormState({
                      name: customer.name,
                      email: customer.email,
                      phone: customer.phone,
                      company: customer.notes ?? "",
                      address: customer.address,
                    });
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={() => setIsEditing(false)}>Save Changes</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Orders */}
        <Card className="rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <CardHeader className="flex flex-col gap-3">
            <CardTitle>Orders</CardTitle>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <Input
                placeholder="Search orders..."
                className="w-full sm:w-1/2"
              />
              <div className="flex items-center gap-2">
                <Select>
                  <SelectTrigger className="w-28">
                    <span>All</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="invoices">Invoices</SelectItem>
                    <SelectItem value="estimates">Estimates</SelectItem>
                    <SelectItem value="agreements">Agreements</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Date Range
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {customerInvoices.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Employee Name</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerInvoices.map(order => (
                    <TableRow key={order.id} className="cursor-pointer hover:bg-muted/40">
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>John Doe</TableCell>
                      <TableCell>${order.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {order.type ?? "Invoice"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {new Date(order.issueDate).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No orders found for this customer.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDetails;
