import * as React from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";

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
          "relative w-full overflow-hidden min-h-[80vh] flex flex-col justify-center",
          className
        )}
        {...props}
      >
        {/* Subtle Background Pattern */}
        {pattern === "dots" && (
          <div className="absolute inset-0 pointer-events-none z-0" style={{ 
            backgroundImage: "radial-gradient(var(--border-default) 1px, transparent 1px)", 
            backgroundSize: "24px 24px",
            maskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
            opacity: 0.5
          }} />
        )}
        
        {pattern === "grid" && (
          <div className="absolute inset-0 pointer-events-none z-0" style={{ 
            backgroundImage: "linear-gradient(var(--border-default) 1px, transparent 1px), linear-gradient(90deg, var(--border-default) 1px, transparent 1px)", 
            backgroundSize: "40px 40px",
            maskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
            opacity: 0.3
          }} />
        )}

        {/* Soft Accent Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-accent/10 blur-[100px] rounded-full pointer-events-none z-0" />

        <Container className="relative z-10 w-full pt-32 pb-16">
          {children}
        </Container>
      </div>
    );
  }
);

HeroContainer.displayName = "HeroContainer";
