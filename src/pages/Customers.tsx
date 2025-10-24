import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { CustomerCard } from "@/components/CustomerCard";
import { CustomerFormModal } from "@/components/modals/CustomerFormModal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { mockCustomers } from "@/data/mockData";

const Customers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("active");

  // Mock data - in real app, filter by active/deactivated status
  const filteredCustomers = mockCustomers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  );

  const activeCustomers = filteredCustomers;
  const deactivatedCustomers = []; // Mock empty array for deactivated

  return (
    <div className="flex-1">
      <AppHeader searchPlaceholder="Search customers..." onSearchChange={setSearchQuery} />

      <main className="px-6 py-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Customers</h1>
            <p className="text-muted-foreground">Manage your customer relationships</p>
          </div>
          <Button onClick={() => setModalOpen(true)} className="gap-2">
            <Plus className="h-5 w-5" />
            Add Customer
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="active">Active Customers</TabsTrigger>
            <TabsTrigger value="deactivated">Deactivated Customers</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeCustomers.map((customer) => (
                <CustomerCard key={customer.id} {...customer} isActive={true} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="deactivated" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deactivatedCustomers.length > 0 ? (
                deactivatedCustomers.map((customer) => (
                  <CustomerCard key={customer.id} {...customer} isActive={false} />
                ))
              ) : (
                <p className="text-muted-foreground col-span-full text-center py-8">
                  No deactivated customers
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <CustomerFormModal open={modalOpen} onOpenChange={setModalOpen} mode="create" />
      </main>
    </div>
  );
};

export default Customers;
