import { NavLink, useLocation } from "react-router-dom";
import { Home, Users, Briefcase, FileText, FileCheck, ClipboardList, UserCheck, Settings, BarChart3, Package, ChevronDown, DollarSign, Calendar, MapPinned, Clock, ArrowUpCircle, RotateCcw } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/Logo";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

const topItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Job Dashboard", url: "/jobs", icon: Briefcase },
];

const salesItems = [
  { title: "Invoices", url: "/invoices", icon: FileText },
  { title: "Estimates", url: "/estimates", icon: FileCheck },
  { title: "Agreements", url: "/agreements", icon: ClipboardList },
];

const appointmentItems = [
  { title: "Manage Appt.", url: "/appointments/manage", icon: Calendar },
  { title: "Add Appt.", url: "/appointments/add", icon: Calendar },
];

const employeeItems = [
  { title: "Employee List", url: "/employees", icon: UserCheck },
  { title: "Schedule", url: "/employees/schedule", icon: Clock },
  { title: "Tracking", url: "/employees/tracking", icon: MapPinned },
];

const inventoryItems = [
  { title: "Inventory List", url: "/inventory", icon: Package },
  { title: "Stock In/Out", url: "/inventory/stock-in-out", icon: ArrowUpCircle },
  { title: "Refunds", url: "/inventory/refunds", icon: RotateCcw },
];

const reportItems = [
  { title: "Invoice Report", url: "/reports/invoice", icon: FileText },
  { title: "Estimate Report", url: "/reports/estimate", icon: FileCheck },
];

const settingsItems = [
  { title: "Profile", url: "/settings/profile", icon: Users },
  { title: "Change Password", url: "/settings/change-password", icon: Settings },
  { title: "Permissions", url: "/settings/permissions", icon: Settings },
  { title: "Business Policies", url: "/settings/business-policies", icon: FileText },
  { title: "Payment Methods", url: "/settings/payment-methods", icon: DollarSign },
  { title: "Card Reader", url: "/settings/card-reader", icon: Settings },
  { title: "Language", url: "/settings/language", icon: Settings },
  { title: "Help", url: "/settings/help", icon: Settings },
];

const mainItems = [
  { title: "Customers", url: "/customers", icon: Users },
];

export function AppSidebar() {
  const { open, setOpen, setOpenMobile, isMobile } = useSidebar();
  const location = useLocation();
  const [salesOpen, setSalesOpen] = useState(true);
  const [appointmentsOpen, setAppointmentsOpen] = useState(false);
  const [employeesOpen, setEmployeesOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const getNavClass = (path: string) => {
    const isActive = location.pathname === path;
    return isActive
      ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
      : "hover:bg-muted";
  };

  const isSalesActive = salesItems.some(item => location.pathname === item.url);
  const isAppointmentsActive = appointmentItems.some(item => location.pathname === item.url);
  const isEmployeesActive = employeeItems.some(item => location.pathname === item.url);
  const isInventoryActive = inventoryItems.some(item => location.pathname === item.url);
  const isReportsActive = reportItems.some(item => location.pathname === item.url);
  const isSettingsActive = settingsItems.some(item => location.pathname === item.url);

  return (
    <Sidebar className="border-r border-border bg-card">
      <SidebarContent className="p-2">
        <div className="p-2 mb-2">
          <Logo size={open ? "md" : "sm"} />
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Top Items */}
              {topItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavClass(item.url)} onClick={handleNavClick}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Sales Collapsible Group */}
              <Collapsible open={salesOpen} onOpenChange={setSalesOpen} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className={isSalesActive ? "bg-primary/10 text-primary" : ""}>
                      <DollarSign className="h-5 w-5" />
                      <span>Sales</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {salesItems.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild>
                            <NavLink to={item.url} className={getNavClass(item.url)} onClick={handleNavClick}>
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Appointments Collapsible Group */}
              <Collapsible open={appointmentsOpen} onOpenChange={setAppointmentsOpen} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className={isAppointmentsActive ? "bg-primary/10 text-primary" : ""}>
                      <Calendar className="h-5 w-5" />
                      <span>Appointment</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {appointmentItems.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild>
                            <NavLink to={item.url} className={getNavClass(item.url)} onClick={handleNavClick}>
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Customers */}
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavClass(item.url)} onClick={handleNavClick}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Employees Collapsible Group */}
              <Collapsible open={employeesOpen} onOpenChange={setEmployeesOpen} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className={isEmployeesActive ? "bg-primary/10 text-primary" : ""}>
                      <UserCheck className="h-5 w-5" />
                      <span>Employees</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {employeeItems.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild>
                            <NavLink to={item.url} className={getNavClass(item.url)} onClick={handleNavClick}>
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Inventory Collapsible Group */}
              <Collapsible open={inventoryOpen} onOpenChange={setInventoryOpen} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className={isInventoryActive ? "bg-primary/10 text-primary" : ""}>
                      <Package className="h-5 w-5" />
                      <span>Inventory</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {inventoryItems.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild>
                            <NavLink to={item.url} className={getNavClass(item.url)} onClick={handleNavClick}>
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Reports Collapsible Group */}
              <Collapsible open={reportsOpen} onOpenChange={setReportsOpen} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className={isReportsActive ? "bg-primary/10 text-primary" : ""}>
                      <BarChart3 className="h-5 w-5" />
                      <span>Reports</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {reportItems.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild>
                            <NavLink to={item.url} className={getNavClass(item.url)} onClick={handleNavClick}>
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Settings Collapsible Group */}
              <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className={isSettingsActive ? "bg-primary/10 text-primary" : ""}>
                      <Settings className="h-5 w-5" />
                      <span>Settings</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {settingsItems.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild>
                            <NavLink to={item.url} className={getNavClass(item.url)} onClick={handleNavClick}>
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}