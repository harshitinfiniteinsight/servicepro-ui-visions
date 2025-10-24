import { Plus, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileText, DollarSign, FileCheck, Users } from "lucide-react";

export const QuickActions = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="lg" className="fixed bottom-24 md:bottom-6 right-6 rounded-full h-16 w-16 shadow-xl z-50">
          <Plus className="h-7 w-7" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-card border-border shadow-xl z-50">
        <DropdownMenuItem className="py-3 cursor-pointer hover:bg-muted">
          <Briefcase className="mr-3 h-5 w-5 text-primary" />
          <span className="font-medium">New Job</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="py-3 cursor-pointer hover:bg-muted">
          <FileText className="mr-3 h-5 w-5 text-info" />
          <span className="font-medium">New Invoice</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="py-3 cursor-pointer hover:bg-muted">
          <DollarSign className="mr-3 h-5 w-5 text-accent" />
          <span className="font-medium">New Estimate</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="py-3 cursor-pointer hover:bg-muted">
          <FileCheck className="mr-3 h-5 w-5 text-success" />
          <span className="font-medium">New Agreement</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="py-3 cursor-pointer hover:bg-muted">
          <Users className="mr-3 h-5 w-5 text-warning" />
          <span className="font-medium">New Customer</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
