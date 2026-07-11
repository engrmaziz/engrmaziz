import * as React from "react";
import { cn } from "@/lib/utils";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { Stack } from "./Stack";

export interface PageHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  align?: "left" | "center" | "right";
  withContainer?: boolean;
}

export const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, title, description, eyebrow, align = "left", withContainer = true, ...props }, ref) => {
    const alignmentClasses = {
      left: "text-left items-start",
      center: "text-center items-center mx-auto",
      right: "text-right items-end ml-auto",
    };

    const content = (
      <Stack
        ref={ref}
        gap="md"
        className={cn(
          "max-w-3xl",
          alignmentClasses[align],
          className
        )}
        {...props}
      >
        {eyebrow && (
          <span className="text-sm font-mono font-medium text-accent uppercase tracking-widest">
            {eyebrow}
          </span>
        )}
        <Heading level={1} className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
          {title}
        </Heading>
        {description && (
          <p className="text-lg md:text-xl text-secondary mt-4 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </Stack>
    );

    if (withContainer) {
      return (
        <Section className="pb-8 pt-20 md:pt-32">
          {content}
        </Section>
      );
    }

    return content;
  }
);

PageHeader.displayName = "PageHeader";
