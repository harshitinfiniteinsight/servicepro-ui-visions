import { NavLink, useLocation } from "react-router-dom";
import { Home, Users, Package, DollarSign, UserCheck, BarChart3, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/Logo";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "CRM", url: "/crm", icon: Users },
  { title: "Inventory", url: "/inventory", icon: Package },
  { title: "Sales", url: "/sales", icon: DollarSign },
  { title: "Employee", url: "/employees", icon: UserCheck },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();

  const getNavClass = (path: string) => {
    const isActive = location.pathname === path;
    return isActive
      ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
      : "hover:bg-muted";
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
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavClass(item.url)}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
