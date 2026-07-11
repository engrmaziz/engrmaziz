import * as React from "react";
import { cn } from "@/lib/utils";
import { PageWrapper } from "@/components/layout/PageWrapper";

export interface PageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  withTopPadding?: boolean;
}

export const PageLayout = React.forwardRef<HTMLDivElement, PageLayoutProps>(
  ({ className, children, withTopPadding = true, ...props }, ref) => {
    return (
      <PageWrapper>
        <div
          ref={ref}
          className={cn(
            "flex flex-col flex-1 w-full",
            withTopPadding && "pt-[var(--nav-height,5rem)]",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </PageWrapper>
    );
  }
);

PageLayout.displayName = "PageLayout";
