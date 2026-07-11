import * as React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface CaseStudyCardProps extends React.HTMLAttributes<HTMLDivElement> {
  client: string;
  title: string;
  description: string;
  stats?: { label: string; value: string }[];
  href: string;
}

export const CaseStudyCard = React.forwardRef<HTMLDivElement, CaseStudyCardProps>(
  ({ className, client, title, description, stats, href, ...props }, ref) => {
    return (
      <Link href={href} className={cn("block group outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xl", className)}>
        <Card ref={ref} interactive className="h-full border-border-default hover:border-accent/50 bg-gradient-to-br from-elevated to-base" {...props}>
          <CardContent className="p-8 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-mono font-medium text-accent uppercase tracking-widest">
                {client}
              </span>
              <div className="w-8 h-8 rounded-full bg-secondary/5 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-primary mb-3">{title}</h3>
            <p className="text-secondary leading-relaxed mb-8 flex-1">{description}</p>
            
            {stats && stats.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-6 border-t border-border-default/50">
                {stats.map((stat, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <span className="text-2xl font-bold text-primary">{stat.value}</span>
                    <span className="text-xs text-secondary font-medium uppercase tracking-wider">{stat.label}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    );
  }
);

CaseStudyCard.displayName = "CaseStudyCard";
