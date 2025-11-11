import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileHeader from "@/components/layout/MobileHeader";
import CustomerCard from "@/components/cards/CustomerCard";
import EmptyState from "@/components/cards/EmptyState";
import { mockCustomers } from "@/data/mobileMockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, Users } from "lucide-react";

const Customers = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  
  const filteredCustomers = mockCustomers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                         c.email.toLowerCase().includes(search.toLowerCase()) ||
                         c.phone.includes(search);
    const matchesFilter = filter === "All" || c.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <MobileHeader 
        title="Customers"
        actions={
          <Button size="sm" onClick={() => navigate("/customers/new")}>
            <Plus className="h-4 w-4" />
          </Button>
        }
      />
      
      <div className="flex-1 overflow-y-auto scrollable px-4 pb-6 space-y-4" style={{ paddingTop: 'calc(3.5rem + env(safe-area-inset-top) + 0.5rem)' }}>
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Filters */}
        <div className="flex gap-2">
          {["All", "Active", "Inactive"].map(f => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f}
            </Button>
          ))}
        </div>
        
        {/* Summary */}
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="font-semibold">Total Customers</span>
            </div>
            <span className="text-2xl font-bold text-primary">{filteredCustomers.length}</span>
          </div>
        </div>
        
        {/* List */}
        {filteredCustomers.length > 0 ? (
          <div className="space-y-3">
            {filteredCustomers.map(customer => (
              <CustomerCard key={customer.id} customer={customer} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Users className="h-10 w-10 text-muted-foreground" />}
            title="No customers found"
            description="Try adjusting your search or filters"
            actionLabel="Add Customer"
            onAction={() => navigate("/customers/new")}
          />
        )}
      </div>
    </div>
  );
};

export default Customers;
