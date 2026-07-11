import * as React from "react";
import { cn } from "@/lib/utils";

export const Subheading = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn("text-2xl md:text-3xl font-bold tracking-tight text-primary", className)}
      {...props}
    />
  )
);
Subheading.displayName = "Subheading";

export const Eyebrow = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn("text-sm font-mono font-medium text-accent uppercase tracking-widest", className)}
      {...props}
    />
  )
);
Eyebrow.displayName = "Eyebrow";

export const Body = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-base md:text-lg text-secondary leading-relaxed", className)}
      {...props}
    />
  )
);
Body.displayName = "Body";

export const Caption = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-secondary/70", className)}
      {...props}
    />
  )
);
Caption.displayName = "Caption";

export const Code = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <code
      ref={ref}
      className={cn("font-mono text-sm px-1.5 py-0.5 rounded-md bg-secondary/10 text-primary", className)}
      {...props}
    />
  )
);
Code.displayName = "Code";

export const Stat = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { value: string; label: string }>(
  ({ className, value, label, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-1", className)} {...props}>
      <span className="text-3xl md:text-4xl font-bold text-primary">{value}</span>
      <span className="text-sm font-medium text-secondary uppercase tracking-wider">{label}</span>
    </div>
  )
);
Stat.displayName = "Stat";
