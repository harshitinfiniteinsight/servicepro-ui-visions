import { Wrench } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export const Logo = ({ size = "md", showText = true }: LogoProps) => {
  const sizes = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  return (
    <div className="flex items-center gap-3">
      <div className="gradient-primary rounded-xl p-2 shadow-lg">
        <Wrench className={`${sizes[size]} text-white`} />
      </div>
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${textSizes[size]} font-bold text-foreground leading-none`}>
            ServicePro
            <span className="text-primary">911</span>
          </h1>
        </div>
      )}
    </div>
  );
};
