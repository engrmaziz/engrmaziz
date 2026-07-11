import * as React from "react";
import { cn } from "@/lib/utils";
import { User, Bot } from "lucide-react";

export interface MessageBubbleProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "content"> {
  role: "user" | "assistant";
  content: React.ReactNode;
}

export const MessageBubble = React.forwardRef<HTMLDivElement, MessageBubbleProps>(
  ({ className, role, content, ...props }, ref) => {
    const isUser = role === "user";

    return (
      <div
        ref={ref}
        className={cn(
          "flex gap-4 w-full",
          isUser ? "justify-end" : "justify-start",
          className
        )}
        {...props}
      >
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0 mt-1">
            <Bot className="w-4 h-4" />
          </div>
        )}
        
        <div
          className={cn(
            "max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed",
            isUser 
              ? "bg-accent text-white rounded-tr-sm" 
              : "bg-elevated border border-border-default text-primary rounded-tl-sm"
          )}
        >
          {content}
        </div>

        {isUser && (
          <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0 mt-1">
            <User className="w-4 h-4" />
          </div>
        )}
      </div>
    );
  }
);

MessageBubble.displayName = "MessageBubble";
