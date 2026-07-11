import * as React from "react";
import { cn } from "@/lib/utils";

export interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  error?: boolean;
  success?: boolean;
}

export const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ className, error, success, children, ...props }, ref) => {
    if (!children) return null;

    return (
      <p
        ref={ref}
        className={cn(
          "text-[0.8rem] font-medium mt-1.5",
          error && "text-red-500 dark:text-red-400",
          success && "text-green-600 dark:text-green-400",
          !error && !success && "text-secondary",
          className
        )}
        {...props}
      >
        {children}
      </p>
    );
  }
);
FormMessage.displayName = "FormMessage";
