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
    <header className="sticky top-0 z-30 glass-effect border-b shadow-lg">
      <div className="flex items-center gap-3 sm:gap-4 md:gap-5 px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-4">
        <SidebarTrigger className="button-scale tablet-touch" />
        
        <div className="flex-1 max-w-2xl md:max-w-3xl">
          <div className="relative group">
            <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 md:h-5 md:w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder={searchPlaceholder}
              className="pl-10 sm:pl-11 md:pl-12 h-10 sm:h-11 md:h-12 bg-background/50 border-border focus:border-primary transition-all shadow-sm hover:shadow-md focus:shadow-lg text-sm md:text-base"
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <Button variant="ghost" size="icon" className="relative button-scale touch-target tablet-touch h-10 w-10 md:h-12 md:w-12">
            <Bell className="h-5 w-5 md:h-6 md:w-6" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full animate-pulse shadow-lg shadow-destructive/50"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-10 w-10 md:h-12 md:w-12 rounded-full p-0 overflow-hidden button-scale touch-target tablet-touch">
                <div className="h-full w-full rounded-full gradient-primary flex items-center justify-center shadow-md hover:shadow-xl transition-shadow">
                  <User className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 md:w-64 bg-card shadow-2xl z-50 animate-scale-in border-border/50">
              <DropdownMenuLabel className="font-display text-base md:text-lg">John Doe</DropdownMenuLabel>
              <DropdownMenuLabel className="font-normal text-sm md:text-base text-muted-foreground">
                john@servicepro911.com
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-sm md:text-base py-2 md:py-3">Profile</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-sm md:text-base py-2 md:py-3">Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive cursor-pointer text-sm md:text-base py-2 md:py-3">Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
