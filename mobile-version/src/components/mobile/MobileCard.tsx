import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface MobileCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const MobileCard = ({ children, className, onClick }: MobileCardProps) => {
  return (
    <Card
      className={cn(
        "p-4 cursor-pointer active:scale-98 transition-transform touch-target",
        onClick && "hover:bg-accent/5",
        className
      )}
      onClick={onClick}
    >
      {children}
    </Card>
  );
};

export default MobileCard;


