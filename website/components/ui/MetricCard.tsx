import * as React from "react";
import { Surface } from "@/components/ui/Surface";
import { cn } from "@/lib/utils";

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  trend?: {
    value: string | number;
    direction: "up" | "down" | "neutral";
  };
  icon?: React.ReactNode;
}

export const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  ({ className, title, value, trend, icon, ...props }, ref) => {
    return (
      <Surface ref={ref} className={cn("p-6 flex flex-col gap-4", className)} {...props}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-secondary">{title}</span>
          {icon && <div className="text-secondary/50">{icon}</div>}
        </div>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-3xl font-bold text-primary tracking-tight">{value}</span>
          {trend && (
            <span
              className={cn(
                "text-xs font-medium px-1.5 py-0.5 rounded-full",
                trend.direction === "up" && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                trend.direction === "down" && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                trend.direction === "neutral" && "bg-secondary/10 text-secondary"
              )}
            >
              {trend.direction === "up" ? "↑" : trend.direction === "down" ? "↓" : ""} {trend.value}
            </span>
          )}
        </div>
      </Surface>
    );
  }
);

MetricCard.displayName = "MetricCard";
