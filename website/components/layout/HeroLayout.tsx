import * as React from "react";
import { cn } from "@/lib/utils";
import { Section, SectionProps } from "@/components/ui/Section";
import { Stack } from "./Stack";

export interface HeroLayoutProps extends Omit<SectionProps, "children" | "content"> {
  content: React.ReactNode;
  visual?: React.ReactNode;
  alignment?: "left" | "center";
}

export const HeroLayout = React.forwardRef<HTMLElement, HeroLayoutProps>(
  ({ className, content, visual, alignment = "left", ...props }, ref) => {
    if (alignment === "center") {
      return (
        <Section
          ref={ref}
          className={cn("min-h-[80vh] flex flex-col items-center justify-center pt-32 pb-16", className)}
          {...props}
        >
          <Stack gap="lg" align="center" className="max-w-4xl text-center w-full">
            {content}
            {visual && <div className="w-full mt-12">{visual}</div>}
          </Stack>
        </Section>
      );
    }

    return (
      <Section
        ref={ref}
        className={cn("min-h-[80vh] flex flex-col justify-center pt-32 pb-16", className)}
        {...props}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center w-full">
          <Stack gap="lg" className="max-w-2xl">
            {content}
          </Stack>
          {visual && (
            <div className="relative w-full h-full min-h-[400px] flex items-center justify-center">
              {visual}
            </div>
          )}
        </div>
      </Section>
    );
  }
);

HeroLayout.displayName = "HeroLayout";
