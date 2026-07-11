import * as React from "react";
import { cn } from "@/lib/utils";

export interface SplitLayoutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "content"> {
  left: React.ReactNode;
  right: React.ReactNode;
  ratio?: "50/50" | "1/3-2/3" | "2/3-1/3" | "auto-1fr" | "1fr-auto";
  reverseOnMobile?: boolean;
}

export const SplitLayout = React.forwardRef<HTMLDivElement, SplitLayoutProps>(
  ({ className, left, right, ratio = "50/50", reverseOnMobile = false, ...props }, ref) => {
    const ratioClasses = {
      "50/50": "md:grid-cols-2",
      "1/3-2/3": "md:grid-cols-[1fr_2fr]",
      "2/3-1/3": "md:grid-cols-[2fr_1fr]",
      "auto-1fr": "md:grid-cols-[auto_1fr]",
      "1fr-auto": "md:grid-cols-[1fr_auto]",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "grid grid-cols-1 gap-8 md:gap-12 lg:gap-16 w-full",
          ratioClasses[ratio],
          className
        )}
        {...props}
      >
        <div className={cn(reverseOnMobile && "order-2 md:order-1")}>{left}</div>
        <div className={cn(reverseOnMobile && "order-1 md:order-2")}>{right}</div>
      </div>
    );
  }
);

SplitLayout.displayName = "SplitLayout";
