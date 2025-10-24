import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, Users, Package, DollarSign, UserCheck, BarChart3, Settings, ChevronDown } from "lucide-react";
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Logo } from "@/components/Logo";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { 
    title: "CRM", 
    icon: Users,
    subItems: [
      { title: "Add New Customer", url: "/crm/add-customer" },
      { title: "Manage Customer", url: "/crm/manage-customer" },
    ]
  },
  { 
    title: "Inventory", 
    icon: Package,
    subItems: [
      { title: "Add Inventory", url: "/inventory/add" },
      { title: "Inventory List", url: "/inventory/list" },
      { title: "Agreements Inventory", url: "/inventory/agreements" },
      { title: "Inventory Refund", url: "/inventory/refund" },
      { title: "Inventory Stock In/Out", url: "/inventory/stock" },
      { title: "Discount", url: "/inventory/discount" },
      { title: "Equipment Tracking", url: "/inventory/equipment" },
      { title: "Low Inventory Count Alert", url: "/inventory/alerts" },
    ]
  },
  { 
    title: "Sales", 
    icon: DollarSign,
    subItems: [
      { title: "Invoices List", url: "/sales/invoices" },
      { title: "Add New Invoice", url: "/sales/add-invoice" },
      { title: "Invoice Due Alert", url: "/sales/invoice-alerts" },
      { title: "Job Estimates List", url: "/sales/estimates" },
      { title: "Add New Estimate", url: "/sales/add-estimate" },
      { title: "Manage Agreement List", url: "/sales/agreements" },
      { title: "Add New Agreement", url: "/sales/add-agreement" },
      { title: "Set Minimum Deposit Percentage", url: "/sales/deposit-settings" },
    ]
  },
  { title: "Employee", url: "/employees", icon: UserCheck },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (title: string) => {
    setOpenItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const getNavClass = (path: string) => {
    const isActive = location.pathname === path;
    return isActive
      ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
      : "hover:bg-muted";
  };

  const getSubNavClass = (path: string) => {
    const isActive = location.pathname === path;
    return isActive
      ? "bg-primary/10 text-primary font-medium"
      : "hover:bg-muted/50";
  };

  return (
    <Sidebar className="border-r border-border">
      <SidebarContent>
        <div className="p-6 border-b border-border">
          <Logo size={open ? "md" : "sm"} />
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {'subItems' in item ? (
                    <Collapsible 
                      open={openItems.includes(item.title)}
                      onOpenChange={() => toggleItem(item.title)}
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="hover:bg-muted">
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                          <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${openItems.includes(item.title) ? 'rotate-180' : ''}`} />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.subItems.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.url}>
                              <SidebarMenuSubButton asChild>
                                <NavLink to={subItem.url} className={getSubNavClass(subItem.url)}>
                                  <span>{subItem.title}</span>
                                </NavLink>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} end className={getNavClass(item.url)}>
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
