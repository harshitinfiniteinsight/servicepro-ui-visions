import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index";
import Customers from "./pages/Customers";
import CustomerDetails from "./pages/CustomerDetails";
import Jobs from "./pages/Jobs";
import Invoices from "./pages/Invoices";
import InvoiceDueAlert from "./pages/InvoiceDueAlert";
import Estimates from "./pages/Estimates";
import Agreements from "./pages/Agreements";
import MinimumDepositPercentage from "./pages/MinimumDepositPercentage";
import Employees from "./pages/Employees";
import Inventory from "./pages/Inventory";
import LowInventoryAlertSettings from "./pages/LowInventoryAlertSettings";
import ManageAppointments from "./pages/ManageAppointments";
import AddAppointment from "./pages/AddAppointment";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider defaultOpen>
          <div className="flex min-h-screen w-full bg-muted/30">
            <AppSidebar />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/customers/:id" element={<CustomerDetails />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/appointments/manage" element={<ManageAppointments />} />
                <Route path="/appointments/add" element={<AddAppointment />} />
                <Route path="/add-appointment" element={<AddAppointment />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/invoices/due-alert" element={<InvoiceDueAlert />} />
                <Route path="/estimates" element={<Estimates />} />
                <Route path="/agreements" element={<Agreements />} />
                <Route path="/agreements/minimum-deposit" element={<MinimumDepositPercentage />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/inventory/alert-settings" element={<LowInventoryAlertSettings />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
