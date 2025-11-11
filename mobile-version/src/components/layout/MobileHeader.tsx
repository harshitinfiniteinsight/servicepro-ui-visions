import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MobileHeaderProps {
  title: string;
  showBack?: boolean;
  actions?: React.ReactNode;
  className?: string;
}

const MobileHeader = ({ title, showBack = false, actions, className }: MobileHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-md border-b-2 border-gray-200 safe-top shadow-sm",
      className
    )}>
      <div className="flex items-center justify-between h-14 px-4 max-w-md mx-auto">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="touch-target hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </Button>
          )}
          <h1 className="text-lg font-bold truncate text-gray-900">{title}</h1>
        </div>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
};

export default MobileHeader;


