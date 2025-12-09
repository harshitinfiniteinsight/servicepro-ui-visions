import { NavLink, useLocation } from "react-router-dom";
import { Home, Users, Briefcase, FileText, FileCheck, ClipboardList, UserCheck, Settings, BarChart3, Package, ChevronDown, DollarSign, Calendar, MapPinned, Clock, ArrowUpCircle, RotateCcw, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
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
  { title: "Sell Products", url: "/sales/sell-products", icon: ShoppingCart },
];

const appointmentItems = [
  { title: "Manage Appointment", url: "/appointments/manage", icon: Calendar },
  { title: "Add Appointment", url: "/appointments/add", icon: Calendar },
];

const employeeItems = [
  { title: "Employee List", url: "/employees", icon: UserCheck },
  { title: "Schedule", url: "/employees/schedule", icon: Clock },
  { title: "Job Route", url: "/employees/job-route", icon: MapPinned },
];

const inventoryItems = [
  { title: "Inventory List", url: "/inventory", icon: Package },
  { title: "Stock In/Out", url: "/inventory/stock-in-out", icon: ArrowUpCircle },
  { title: "Refunds", url: "/inventory/refunds", icon: RotateCcw },
];

const mainItems = [
  { title: "Customers", url: "/customers", icon: Users },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { open, setOpen, setOpenMobile, isMobile } = useSidebar();
  const location = useLocation();
  const [salesOpen, setSalesOpen] = useState(true);
  const [appointmentsOpen, setAppointmentsOpen] = useState(true);
  const [employeesOpen, setEmployeesOpen] = useState(true);
  const [inventoryOpen, setInventoryOpen] = useState(true);

  // Handler to close sidebar when a menu item is clicked
  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    } else {
      setOpen(false);
    }
  };

  const getNavClass = (path: string, exactMatch: boolean = false) => {
    const isActive = exactMatch 
      ? location.pathname === path 
      : location.pathname === path || location.pathname.startsWith(path + "/");
    return isActive
      ? "bg-primary text-white hover:bg-primary hover:text-white [&>svg]:text-white [&>svg]:stroke-white"
      : "hover:bg-muted";
  };

  const isSalesActive = salesItems.some(item => 
    location.pathname === item.url || 
    location.pathname.startsWith(item.url + "/")
  );
  const isAppointmentsActive = appointmentItems.some(item => 
    location.pathname === item.url || 
    location.pathname.startsWith(item.url + "/")
  );
  const isEmployeesActive = employeeItems.some(item => 
    location.pathname === item.url || 
    location.pathname.startsWith(item.url + "/")
  );
  const isInventoryActive = inventoryItems.some(item => 
    location.pathname === item.url || 
    location.pathname.startsWith(item.url + "/")
  );

  return (
    <Sidebar className="border-r border-border">
      <SidebarContent className="p-4 md:p-6">
        <div className="p-4 md:p-6 border-b border-border -mx-4 md:-mx-6">
          <Logo size={open ? "md" : "sm"} />
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Top Items */}
              {topItems.map((item) => {
                const isActive = location.pathname === item.url || (item.url === "/" ? location.pathname === "/" : false);
                return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                      <NavLink to={item.url} end className={getNavClass(item.url, true)} onClick={handleNavClick}>
                        <item.icon className={cn("h-5 w-5", isActive && "text-white")} />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                );
              })}

              {/* Sales Collapsible Group */}
              <Collapsible open={salesOpen} onOpenChange={setSalesOpen} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className={isSalesActive ? "bg-primary text-white hover:bg-primary hover:text-white" : ""}>
                      <DollarSign className={cn("h-5 w-5", isSalesActive && "text-white")} />
                      <span className={isSalesActive ? "text-white" : ""}>Sales</span>
                      <ChevronDown className={cn("ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180", isSalesActive && "text-white")} />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {salesItems.map((item) => {
                        const isActive = location.pathname === item.url || location.pathname.startsWith(item.url + "/");
                        return (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild>
                            <NavLink to={item.url} className={getNavClass(item.url)} onClick={handleNavClick}>
                                <item.icon className={cn("h-4 w-4", isActive && "text-white")} />
                              <span>{item.title}</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Appointments Collapsible Group */}
              <Collapsible open={appointmentsOpen} onOpenChange={setAppointmentsOpen} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className={isAppointmentsActive ? "bg-primary text-white hover:bg-primary hover:text-white" : ""}>
                      <Calendar className={cn("h-5 w-5", isAppointmentsActive && "text-white")} />
                      <span className={isAppointmentsActive ? "text-white" : ""}>Appointment</span>
                      <ChevronDown className={cn("ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180", isAppointmentsActive && "text-white")} />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {appointmentItems.map((item) => {
                        const isActive = location.pathname === item.url || location.pathname.startsWith(item.url + "/");
                        return (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild>
                            <NavLink to={item.url} className={getNavClass(item.url)} onClick={handleNavClick}>
                                <item.icon className={cn("h-4 w-4", isActive && "text-white")} />
                              <span>{item.title}</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Employees Collapsible Group */}
              <Collapsible open={employeesOpen} onOpenChange={setEmployeesOpen} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className={isEmployeesActive ? "bg-primary text-white hover:bg-primary hover:text-white" : ""}>
                      <UserCheck className={cn("h-5 w-5", isEmployeesActive && "text-white")} />
                      <span className={isEmployeesActive ? "text-white" : ""}>Employees</span>
                      <ChevronDown className={cn("ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180", isEmployeesActive && "text-white")} />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {employeeItems.map((item) => {
                        const isActive = location.pathname === item.url || location.pathname.startsWith(item.url + "/");
                        return (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild>
                            <NavLink to={item.url} className={getNavClass(item.url)} onClick={handleNavClick}>
                                <item.icon className={cn("h-4 w-4", isActive && "text-white")} />
                              <span>{item.title}</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Inventory Collapsible Group */}
              <Collapsible open={inventoryOpen} onOpenChange={setInventoryOpen} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className={isInventoryActive ? "bg-primary text-white hover:bg-primary hover:text-white" : ""}>
                      <Package className={cn("h-5 w-5", isInventoryActive && "text-white")} />
                      <span className={isInventoryActive ? "text-white" : ""}>Inventory</span>
                      <ChevronDown className={cn("ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180", isInventoryActive && "text-white")} />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {inventoryItems.map((item) => {
                        const isActive = location.pathname === item.url || location.pathname.startsWith(item.url + "/");
                        return (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild>
                            <NavLink to={item.url} className={getNavClass(item.url)} onClick={handleNavClick}>
                                <item.icon className={cn("h-4 w-4", isActive && "text-white")} />
                              <span>{item.title}</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Remaining Main Items */}
              {mainItems.map((item) => {
                const isActive = location.pathname === item.url || location.pathname.startsWith(item.url + "/");
                return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavClass(item.url)} onClick={handleNavClick}>
                        <item.icon className={cn("h-5 w-5", isActive && "text-white")} />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
