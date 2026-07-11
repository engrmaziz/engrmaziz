import * as React from "react";
import { cn } from "@/lib/utils";

export interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ className, title, description, icon, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex flex-col gap-3 group", className)} {...props}>
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-2 group-hover:bg-accent group-hover:text-white transition-colors">
            {icon}
          </div>
        )}
        <h4 className="text-lg font-semibold text-primary">{title}</h4>
        <p className="text-sm text-secondary leading-relaxed">{description}</p>
      </div>
    );
  }
);

FeatureCard.displayName = "FeatureCard";
