import * as React from "react";
import { cn } from "@/lib/utils";
import { Stack } from "@/components/layout/Stack";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon, title, description, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center text-center p-8 md:p-12 border border-dashed border-border-default rounded-xl bg-base/50",
          className
        )}
        {...props}
      >
        <Stack gap="sm" align="center" className="max-w-md">
          {icon && (
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-2">
              {icon}
            </div>
          )}
          <h3 className="text-lg font-semibold text-primary">{title}</h3>
          {description && <p className="text-sm text-secondary">{description}</p>}
          {action && <div className="mt-4">{action}</div>}
        </Stack>
      </div>
    );
  }
);

EmptyState.displayName = "EmptyState";
