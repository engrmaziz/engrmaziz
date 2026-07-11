import * as React from "react";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ServiceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  category: string;
  href: string;
  tags?: string[];
}

export const ServiceCard = React.forwardRef<HTMLDivElement, ServiceCardProps>(
  ({ className, title, description, category, href, tags = [], ...props }, ref) => {
    return (
      <Card ref={ref} className={cn("flex flex-col h-full border-border-default hover:border-accent/30 transition-all duration-300 group overflow-hidden bg-elevated", className)} {...props}>
        <div className="p-8 pb-6 border-b border-border-default/50 flex-grow">
          <div className="flex items-center gap-2 mb-6">
            <Badge variant="outline" className="text-xs uppercase tracking-wider font-mono border-accent/20 text-accent bg-accent/5">
              {category}
            </Badge>
          </div>
          
          <CardTitle className="text-2xl font-bold mb-4 text-primary group-hover:text-accent transition-colors flex items-center justify-between">
            {title}
            <ArrowUpRight className="w-5 h-5 text-secondary opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
          </CardTitle>
          
          <CardDescription className="text-base text-secondary leading-relaxed line-clamp-3">
            {description}
          </CardDescription>
        </div>

        <div className="p-6 pt-4 bg-base/30 mt-auto">
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.slice(0, 3).map((tag) => (
                <span key={tag} className="px-2 py-1 bg-elevated border border-border-default rounded text-xs font-mono text-secondary">
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="px-2 py-1 bg-elevated border border-border-default rounded text-xs font-mono text-secondary">
                  +{tags.length - 3}
                </span>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-accent flex items-center gap-2 group-hover:gap-3 transition-all">
              Explore Service <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
        
        <Link href={href} className="absolute inset-0 z-0 opacity-0" aria-label={`View service details for ${title}`}>
          View Details
        </Link>
      </Card>
    );
  }
);

ServiceCard.displayName = "ServiceCard";
