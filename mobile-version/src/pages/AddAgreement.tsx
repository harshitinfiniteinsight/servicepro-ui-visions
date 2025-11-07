import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileHeader from "@/components/layout/MobileHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockCustomers, serviceTypes } from "@/data/mobileMockData";
import { Search, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const AddAgreement = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [agreementType, setAgreementType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [monthlyAmount, setMonthlyAmount] = useState("");
  const [renewalStatus, setRenewalStatus] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [billingSchedule, setBillingSchedule] = useState("");

  const filteredCustomers = mockCustomers.filter(c =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const steps = [
    { number: 1, title: "Customer" },
    { number: 2, title: "Terms" },
    { number: 3, title: "Services" },
    { number: 4, title: "Review" },
  ];

  const toggleService = (service: string) => {
    setServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <MobileHeader title="New Agreement" showBack={true} />
      
      {/* Progress Indicator */}
      <div className="px-4 pt-16 pb-4">
        <div className="flex items-center justify-between mb-2">
          {steps.map((s, idx) => (
            <div key={s.number} className="flex items-center flex-1">
              <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold",
                step >= s.number ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                {step > s.number ? "✓" : s.number}
              </div>
              {idx < steps.length - 1 && (
                <div className={cn(
                  "flex-1 h-1 mx-2",
                  step > s.number ? "bg-primary" : "bg-muted"
                )} />
              )}
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Step {step} of {steps.length}: {steps[step - 1].title}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto scrollable px-4 pb-6 space-y-4">
        {/* Step 1: Customer */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            {customerSearch && (
              <div className="space-y-2">
                {filteredCustomers.map(customer => (
                  <div
                    key={customer.id}
                    className={cn(
                      "p-4 rounded-xl border cursor-pointer transition-colors",
                      selectedCustomer === customer.id
                        ? "bg-primary/10 border-primary"
                        : "bg-card hover:bg-accent/5"
                    )}
                    onClick={() => setSelectedCustomer(customer.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">{customer.email}</p>
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
        )}

        {/* Step 2: Terms */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label>Agreement Type</Label>
              <Select value={agreementType} onValueChange={setAgreementType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Annual Maintenance">Annual Maintenance</SelectItem>
                  <SelectItem value="Quarterly Service">Quarterly Service</SelectItem>
                  <SelectItem value="Premium Plan">Premium Plan</SelectItem>
                  <SelectItem value="Basic Coverage">Basic Coverage</SelectItem>
                  <SelectItem value="Commercial Plan">Commercial Plan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Start Date</Label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div>
                <Label>End Date</Label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>

            <div>
              <Label>Monthly Amount</Label>
              <Input
                type="number"
                value={monthlyAmount}
                onChange={(e) => setMonthlyAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div>
              <Label>Renewal Status</Label>
              <Select value={renewalStatus} onValueChange={setRenewalStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select renewal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Auto-renew">Auto-renew</SelectItem>
                  <SelectItem value="Manual">Manual</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Step 3: Services */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <Label>Billing Schedule</Label>
              <Select value={billingSchedule} onValueChange={setBillingSchedule}>
                <SelectTrigger>
                  <SelectValue placeholder="Select schedule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                  <SelectItem value="Annually">Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Services Included</Label>
              <div className="mt-2 space-y-2">
                {serviceTypes.map(service => (
                  <div
                    key={service}
                    className={cn(
                      "p-3 rounded-lg border cursor-pointer transition-colors",
                      services.includes(service)
                        ? "bg-primary/10 border-primary"
                        : "bg-card hover:bg-accent/5"
                    )}
                    onClick={() => toggleService(service)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{service}</span>
                      {services.includes(service) && (
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-xs text-primary-foreground">✓</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border bg-card">
              <h3 className="font-semibold mb-2">Customer</h3>
              <p className="text-sm text-muted-foreground">
                {selectedCustomer ? mockCustomers.find(c => c.id === selectedCustomer)?.name : "Not selected"}
              </p>
            </div>

            <div className="p-4 rounded-xl border bg-card">
              <h3 className="font-semibold mb-2">Agreement Details</h3>
              <div className="space-y-1 text-sm">
                <p><span className="text-muted-foreground">Type:</span> {agreementType || "Not selected"}</p>
                <p><span className="text-muted-foreground">Period:</span> {startDate} to {endDate}</p>
                <p><span className="text-muted-foreground">Monthly:</span> ${monthlyAmount || "0.00"}</p>
                <p><span className="text-muted-foreground">Renewal:</span> {renewalStatus || "Not selected"}</p>
              </div>
            </div>

            {services.length > 0 && (
              <div className="p-4 rounded-xl border bg-card">
                <h3 className="font-semibold mb-2">Services ({services.length})</h3>
                <div className="space-y-1">
                  {services.map(service => (
                    <p key={service} className="text-sm text-muted-foreground">• {service}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t bg-background space-y-2">
        <div className="flex gap-2">
          {step > 1 && (
            <Button variant="outline" className="flex-1" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          {step < 4 ? (
            <Button
              className="flex-1"
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && !selectedCustomer || step === 2 && (!agreementType || !startDate || !endDate)}
            >
              Next
            </Button>
          ) : (
            <Button className="flex-1" onClick={() => navigate("/agreements")}>
              Create Agreement
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddAgreement;
