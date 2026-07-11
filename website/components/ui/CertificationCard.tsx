import * as React from "react";
import { Surface } from "@/components/ui/Surface";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

export interface CertificationCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
  icon?: React.ReactNode;
}

export const CertificationCard = React.forwardRef<HTMLDivElement, CertificationCardProps>(
  ({ className, title, issuer, date, credentialUrl, icon, ...props }, ref) => {
    const cardContent = (
      <Surface
        variant="elevated"
        className={cn(
          "p-5 flex items-start gap-4 transition-colors",
          credentialUrl && "hover:border-accent/50 group cursor-pointer",
          className
        )}
        ref={ref}
        {...props}
      >
        {icon && (
          <div className="w-12 h-12 shrink-0 bg-base border border-border-default rounded-md flex items-center justify-center p-2">
            {icon}
          </div>
        )}
        <div className="flex flex-col min-w-0 flex-1">
          <h4 className="font-semibold text-primary pr-6 relative">
            {title}
            {credentialUrl && (
              <ExternalLink className="w-3.5 h-3.5 absolute right-0 top-1 text-secondary opacity-0 group-hover:opacity-100 group-hover:text-accent transition-all" />
            )}
          </h4>
          <span className="text-sm text-secondary mt-1">{issuer}</span>
          <span className="text-xs font-mono text-secondary/70 mt-2">{date}</span>
        </div>
      </Surface>
    );

    if (credentialUrl) {
      return (
        <a href={credentialUrl} target="_blank" rel="noopener noreferrer" className="block outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xl">
          {cardContent}
        </a>
      );
    }

    return cardContent;
  }
);

CertificationCard.displayName = "CertificationCard";
