import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppHeaderProps {
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
}

export const AppHeader = ({ searchPlaceholder = "Search...", onSearchChange }: AppHeaderProps) => {
  return (
    <header className="sticky top-0 z-30 bg-card border-b border-border backdrop-blur-sm bg-card/95">
      <div className="flex items-center gap-4 px-6 py-4">
        <SidebarTrigger />
        
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              className="pl-11 h-11 bg-background border-border"
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full p-0 overflow-hidden">
                <div className="h-full w-full rounded-full gradient-primary flex items-center justify-center shadow-md">
                  <User className="h-5 w-5 text-white" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card z-50">
              <DropdownMenuLabel>John Doe</DropdownMenuLabel>
              <DropdownMenuLabel className="font-normal text-muted-foreground">
                john@servicepro911.com
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
