import * as React from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { DotGrid } from "@/components/fx/DotGrid";

export interface HeroContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  pattern?: "dots" | "grid" | "none";
}

export const HeroContainer = React.forwardRef<HTMLDivElement, HeroContainerProps>(
  ({ className, children, pattern = "dots", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex min-h-[92vh] w-full flex-col justify-center overflow-hidden",
          className
        )}
        {...props}
      >
        {pattern !== "none" ? <DotGrid /> : null}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"
        />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-base/20 via-transparent to-base" />
        <Container className="relative z-10 w-full pb-16 pt-28 md:pt-32">{children}</Container>
      </div>
    );
  }
);

HeroContainer.displayName = "HeroContainer";
