import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileHeader from "@/components/layout/MobileHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockCustomers, mockEmployees, serviceTypes } from "@/data/mobileMockData";
import { Search, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const AddAppointment = () => {
  const navigate = useNavigate();
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [serviceType, setServiceType] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [technician, setTechnician] = useState("");
  const [notes, setNotes] = useState("");

  const filteredCustomers = mockCustomers.filter(c =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const availableTechnicians = mockEmployees.filter(e => e.status === "Active" && e.role.includes("Technician"));

  const handleSubmit = () => {
    // In real app, save appointment
    navigate("/appointments");
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <MobileHeader title="New Appointment" showBack={true} />
      
      <div className="flex-1 overflow-y-auto scrollable pt-14 px-4 pb-6 space-y-4">
        {/* Customer Selection */}
        <div>
          <Label>Customer</Label>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          {customerSearch && (
            <div className="mt-2 space-y-2">
              {filteredCustomers.map(customer => (
                <div
                  key={customer.id}
                  className={cn(
                    "p-4 rounded-xl border cursor-pointer transition-colors",
                    selectedCustomer === customer.id
                      ? "bg-primary/10 border-primary"
                      : "bg-card hover:bg-accent/5"
                  )}
                  onClick={() => {
                    setSelectedCustomer(customer.id);
                    setCustomerSearch(customer.name);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">{customer.email}</p>
                      <p className="text-sm text-muted-foreground">{customer.phone}</p>
                    </div>
                    {selectedCustomer === customer.id && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <ChevronRight className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Service Type */}
        <div>
          <Label>Service Type</Label>
          <Select value={serviceType} onValueChange={setServiceType}>
            <SelectTrigger>
              <SelectValue placeholder="Select service type" />
            </SelectTrigger>
            <SelectContent>
              {serviceTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date */}
        <div>
          <Label>Date</Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Time */}
        <div>
          <Label>Time</Label>
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        {/* Duration */}
        <div>
          <Label>Duration</Label>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.5">30 minutes</SelectItem>
              <SelectItem value="1">1 hour</SelectItem>
              <SelectItem value="1.5">1.5 hours</SelectItem>
              <SelectItem value="2">2 hours</SelectItem>
              <SelectItem value="3">3 hours</SelectItem>
              <SelectItem value="4">4 hours</SelectItem>
              <SelectItem value="5">5 hours</SelectItem>
              <SelectItem value="8">8 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Technician */}
        <div>
          <Label>Assign Technician</Label>
          <Select value={technician} onValueChange={setTechnician}>
            <SelectTrigger>
              <SelectValue placeholder="Select technician" />
            </SelectTrigger>
            <SelectContent>
              {availableTechnicians.map(tech => (
                <SelectItem key={tech.id} value={tech.id}>
                  {tech.name} - {tech.role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Notes */}
        <div>
          <Label>Notes</Label>
          <textarea
            className="w-full min-h-[100px] p-3 rounded-lg border bg-background"
            placeholder="Add any special instructions or notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t bg-background">
        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={!selectedCustomer || !serviceType || !date || !time || !duration}
        >
          Book Appointment
        </Button>
      </div>
    </div>
  );
};

export default AddAppointment;
