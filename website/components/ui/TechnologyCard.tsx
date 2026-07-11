import * as React from "react";
import { Surface } from "@/components/ui/Surface";
import { cn } from "@/lib/utils";

export interface TechnologyCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  icon?: React.ReactNode;
  category?: string;
  level?: "Beginner" | "Intermediate" | "Advanced" | "Expert";
}

export const TechnologyCard = React.forwardRef<HTMLDivElement, TechnologyCardProps>(
  ({ className, name, icon, category, level, ...props }, ref) => {
    return (
      <Surface
        ref={ref}
        variant="elevated"
        className={cn("p-4 flex items-center gap-4 hover:border-accent/50 transition-colors group cursor-default", className)}
        {...props}
      >
        {icon && (
          <div className="w-10 h-10 shrink-0 bg-secondary/5 rounded-md flex items-center justify-center text-secondary group-hover:text-accent transition-colors">
            {icon}
          </div>
        )}
        <div className="flex flex-col min-w-0">
          <span className="font-medium text-primary truncate">{name}</span>
          {(category || level) && (
            <span className="text-xs text-secondary truncate">
              {category} {category && level && "•"} {level}
            </span>
          )}
        </div>
      </Surface>
    );
  }
);

TechnologyCard.displayName = "TechnologyCard";
