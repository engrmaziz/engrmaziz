import * as React from "react";
import { cn } from "@/lib/utils";

export interface TimelineCardProps extends React.HTMLAttributes<HTMLDivElement> {
  date: string;
  title: string;
  subtitle?: string;
  description: string;
  isLast?: boolean;
}

export const TimelineCard = React.forwardRef<HTMLDivElement, TimelineCardProps>(
  ({ className, date, title, subtitle, description, isLast = false, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("relative pl-8 md:pl-0", className)} {...props}>
        <div className="md:grid md:grid-cols-5 md:gap-8 items-start">
          <div className="md:col-span-1 md:text-right mb-2 md:mb-0 pt-1">
            <span className="text-sm font-mono font-medium text-accent">{date}</span>
          </div>
          
          <div className="relative md:col-span-4 pb-12">
            {/* Timeline Line */}
            {!isLast && (
              <div className="absolute left-[-2rem] md:left-[-2.5rem] top-8 bottom-[-2rem] w-px bg-border-default" />
            )}
            
            {/* Timeline Dot */}
            <div className="absolute left-[-2.35rem] md:left-[-2.85rem] top-2 w-3 h-3 rounded-full bg-base border-2 border-accent" />
            
            <div className="bg-elevated border border-border-default p-6 rounded-xl shadow-sm">
              <h4 className="text-lg font-bold text-primary">{title}</h4>
              {subtitle && <span className="block text-sm text-secondary font-medium mt-1 mb-3">{subtitle}</span>}
              <p className="text-secondary leading-relaxed mt-2">{description}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

TimelineCard.displayName = "TimelineCard";
