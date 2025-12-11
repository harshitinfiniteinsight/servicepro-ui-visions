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

  // Handler to close sidebar when a menu item is clicked
  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
    // Do not close on desktop
  };

<<<<<<< HEAD
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
=======
  const getNavClass = (path: string, exactMatch: boolean = false) => {
    const isActive = exactMatch
      ? location.pathname === path
      : location.pathname === path || location.pathname.startsWith(path + "/");
    return isActive
      ? "bg-primary text-white hover:bg-primary hover:text-white [&>svg]:text-white [&>svg]:stroke-white"
      : "hover:bg-muted hover:text-black";
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
  const isReportsActive = reportItems.some(item =>
    location.pathname === item.url ||
    location.pathname.startsWith(item.url + "/")
  );
  const isSettingsActive = settingsItems.some(item =>
    location.pathname === item.url ||
    location.pathname.startsWith(item.url + "/")
  );
>>>>>>> 364b4fc (feat: Refactor navigation to sidebar, implement table view for estimates, and add convert to invoice option)

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
<<<<<<< HEAD
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
=======
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
>>>>>>> 364b4fc (feat: Refactor navigation to sidebar, implement table view for estimates, and add convert to invoice option)

              {/* Sales Collapsible Group */}
              <Collapsible open={salesOpen} onOpenChange={setSalesOpen} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
<<<<<<< HEAD
                    <SidebarMenuButton className={isSalesActive ? "bg-primary/10 text-primary" : ""}>
                      <DollarSign className="h-5 w-5" />
                      <span>Sales</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
=======
                    <SidebarMenuButton className={isSalesActive ? "bg-primary text-white hover:bg-primary hover:text-white" : "hover:text-black"}>
                      <DollarSign className={cn("h-5 w-5", isSalesActive && "text-white")} />
                      <span className={isSalesActive ? "text-white" : ""}>Sales</span>
                      <ChevronDown className={cn("ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180", isSalesActive && "text-white")} />
>>>>>>> 364b4fc (feat: Refactor navigation to sidebar, implement table view for estimates, and add convert to invoice option)
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
<<<<<<< HEAD
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
=======
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
>>>>>>> 364b4fc (feat: Refactor navigation to sidebar, implement table view for estimates, and add convert to invoice option)
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Appointments Collapsible Group */}
              <Collapsible open={appointmentsOpen} onOpenChange={setAppointmentsOpen} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
<<<<<<< HEAD
                    <SidebarMenuButton className={isAppointmentsActive ? "bg-primary/10 text-primary" : ""}>
                      <Calendar className="h-5 w-5" />
                      <span>Appointment</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
=======
                    <SidebarMenuButton className={isAppointmentsActive ? "bg-primary text-white hover:bg-primary hover:text-white" : "hover:text-black"}>
                      <Calendar className={cn("h-5 w-5", isAppointmentsActive && "text-white")} />
                      <span className={isAppointmentsActive ? "text-white" : ""}>Appointments</span>
                      <ChevronDown className={cn("ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180", isAppointmentsActive && "text-white")} />
>>>>>>> 364b4fc (feat: Refactor navigation to sidebar, implement table view for estimates, and add convert to invoice option)
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
<<<<<<< HEAD
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
=======
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
>>>>>>> 364b4fc (feat: Refactor navigation to sidebar, implement table view for estimates, and add convert to invoice option)
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Customers */}
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

              {/* Employees Collapsible Group */}
              <Collapsible open={employeesOpen} onOpenChange={setEmployeesOpen} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
<<<<<<< HEAD
                    <SidebarMenuButton className={isEmployeesActive ? "bg-primary/10 text-primary" : ""}>
                      <UserCheck className="h-5 w-5" />
                      <span>Employees</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
=======
                    <SidebarMenuButton className={isEmployeesActive ? "bg-primary text-white hover:bg-primary hover:text-white" : "hover:text-black"}>
                      <UserCheck className={cn("h-5 w-5", isEmployeesActive && "text-white")} />
                      <span className={isEmployeesActive ? "text-white" : ""}>Employees</span>
                      <ChevronDown className={cn("ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180", isEmployeesActive && "text-white")} />
>>>>>>> 364b4fc (feat: Refactor navigation to sidebar, implement table view for estimates, and add convert to invoice option)
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
<<<<<<< HEAD
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
=======
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
>>>>>>> 364b4fc (feat: Refactor navigation to sidebar, implement table view for estimates, and add convert to invoice option)
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Inventory Collapsible Group */}
              <Collapsible open={inventoryOpen} onOpenChange={setInventoryOpen} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
<<<<<<< HEAD
                    <SidebarMenuButton className={isInventoryActive ? "bg-primary/10 text-primary" : ""}>
                      <Package className="h-5 w-5" />
                      <span>Inventory</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
=======
                    <SidebarMenuButton className={isInventoryActive ? "bg-primary text-white hover:bg-primary hover:text-white" : "hover:text-black"}>
                      <Package className={cn("h-5 w-5", isInventoryActive && "text-white")} />
                      <span className={isInventoryActive ? "text-white" : ""}>Inventory</span>
                      <ChevronDown className={cn("ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180", isInventoryActive && "text-white")} />
>>>>>>> 364b4fc (feat: Refactor navigation to sidebar, implement table view for estimates, and add convert to invoice option)
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
<<<<<<< HEAD
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
=======
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
>>>>>>> 364b4fc (feat: Refactor navigation to sidebar, implement table view for estimates, and add convert to invoice option)
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

<<<<<<< HEAD
              {/* Remaining Main Items */}
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
=======
              {/* Reports Collapsible Group */}
              <Collapsible open={reportsOpen} onOpenChange={setReportsOpen} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className={isReportsActive ? "bg-primary text-white hover:bg-primary hover:text-white" : "hover:text-black"}>
                      <BarChart3 className={cn("h-5 w-5", isReportsActive && "text-white")} />
                      <span className={isReportsActive ? "text-white" : ""}>Reports</span>
                      <ChevronDown className={cn("ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180", isReportsActive && "text-white")} />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {reportItems.map((item) => {
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

              {/* Settings Collapsible Group */}
              <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className={isSettingsActive ? "bg-primary text-white hover:bg-primary hover:text-white" : "hover:text-black"}>
                      <Settings className={cn("h-5 w-5", isSettingsActive && "text-white")} />
                      <span className={isSettingsActive ? "text-white" : ""}>Settings</span>
                      <ChevronDown className={cn("ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180", isSettingsActive && "text-white")} />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {settingsItems.map((item) => {
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

>>>>>>> 364b4fc (feat: Refactor navigation to sidebar, implement table view for estimates, and add convert to invoice option)
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
