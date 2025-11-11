import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MobileHeader from "@/components/layout/MobileHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { mockAppointments, mockCustomers, mockEmployees, serviceTypes } from "@/data/mobileMockData";
import { Plus, Users, UserCheck, UserRoundPlus, Calendar, Clock, Bell, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const reminderOptions = [
  "15 minutes",
  "30 minutes",
  "1 hour",
  "2 hours",
  "1 day",
] as const;

interface AddAppointmentProps {
  mode?: "create" | "edit";
}

const AddAppointment = ({ mode = "create" }: AddAppointmentProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [category, setCategory] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reminder, setReminder] = useState("30 minutes");
  const [note, setNote] = useState("");

  const activeEmployees = useMemo(
    () => mockEmployees.filter(emp => emp.status === "Active"),
    []
  );
  const selectedCustomerRecord = useMemo(
    () => mockCustomers.find(customer => customer.id === customerId),
    [customerId]
  );

  useEffect(() => {
    if (mode === "edit" && id) {
      const appointment = mockAppointments.find(apt => apt.id === id);
      if (appointment) {
        setSubject(appointment.service);
        setEmployeeId(appointment.technicianId);
        setCustomerId(appointment.customerId);
        setCategory(serviceTypes.includes(appointment.service) ? appointment.service : "");
        setEmail(`${appointment.customerName.split(" ").join(".").toLowerCase()}@example.com`);
        const customer = mockCustomers.find(c => c.id === appointment.customerId);
        setPhone(customer?.phone ?? "");
        setAddress(customer?.address ?? "");
        setDate(appointment.date);
        setTime(
          appointment.time
            ? appointment.time
                .replace(" AM", "")
                .replace(" PM", "")
            : ""
        );
        setReminder("30 minutes");
        setNote(appointment.status === "Pending" ? "Follow up required" : "");
      }
    }
  }, [mode, id]);

  const handleSubmit = () => {
    navigate("/appointments/manage");
  };

  const isFormValid = subject && employeeId && customerId && category && email && phone && date && time;

  return (
    <div className="h-full flex flex-col overflow-hidden bg-muted/10">
      <MobileHeader title={mode === "edit" ? "Edit Appointment" : "Add Appointment"} showBack />

      <div className="flex-1 overflow-y-auto scrollable pt-14 pb-6">
        <div className="mx-4 rounded-3xl border border-gray-100 bg-white shadow-sm">
          <div className="px-5 py-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Schedule a new appointment</h2>
            <p className="text-sm text-muted-foreground mt-1">Provide the details below to confirm the booking.</p>
          </div>

          <div className="px-5 py-6 space-y-6">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1">
                <span>Appointment Subject</span>
                <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="e.g., HVAC Maintenance Check"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4">
                <div className="flex-1 space-y-2">
                  <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1">
                    <span>Employee</span>
                    <span className="text-destructive">*</span>
                  </Label>
                  <Select value={employeeId} onValueChange={setEmployeeId}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Choose employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeEmployees.map(emp => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.name} — {emp.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 space-y-2 mt-4 sm:mt-0">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1">
                      <span>Customers</span>
                      <span className="text-destructive">*</span>
                    </Label>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-xl border border-dashed border-gray-300 text-primary"
                      onClick={() => navigate("/customers/new")}
                    >
                      <UserRoundPlus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Select value={customerId} onValueChange={setCustomerId}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Choose customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCustomers.map(customer => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name} — {customer.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {selectedCustomerRecord && (
                <p className="text-xs text-muted-foreground">
                  {selectedCustomerRecord.phone} · {selectedCustomerRecord.address}
                </p>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1">
                    <span>Category</span>
                    <span className="text-destructive">*</span>
                  </Label>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-xl border border-dashed border-gray-300 text-primary"
                    onClick={() => navigate("/services/new")}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Choose category" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-muted-foreground">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-10"
                    placeholder="customer@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-muted-foreground">Phone Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-10"
                    placeholder="+1 (555) 123-4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">Address</Label>
              <Textarea
                placeholder="123 Main St, City, State"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1">
                  <span>Appointment Date</span>
                  <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1">
                  <span>Appointment Time</span>
                  <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">Appointment Note</Label>
              <Textarea
                placeholder="Additional notes or special instructions..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="min-h-[90px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">Reminder Before</Label>
              <div className="relative">
                <Bell className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Select value={reminder} onValueChange={setReminder}>
                  <SelectTrigger className="pl-10 h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {reminderOptions.map(option => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-4 mt-4 flex flex-col gap-2 pb-2 safe-bottom">
          <Button
            className="w-full rounded-full py-3 text-sm font-semibold"
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            {mode === "edit" ? "Update Appointment" : "Add Appointment"}
          </Button>
          <Button
            variant="outline"
            className="w-full rounded-full py-3 text-sm font-semibold text-gray-700 border-gray-200 hover:bg-muted"
            onClick={() => navigate(-1)}
            type="button"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddAppointment;
