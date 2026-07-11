/* eslint-disable */
// @ts-nocheck
import * as React from "react";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ArrowUpRight, Clock, Calendar, Bookmark } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface BlogCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  category: string;
  date: string;
  readingTime: string;
  difficulty?: string;
  href: string;
  tags?: string[];
}

export const BlogCard = React.forwardRef<HTMLDivElement, BlogCardProps>(
  ({ className, title, description, category, date, readingTime, difficulty, href, tags = [], ...props }, ref) => {
    
    // Format date beautifully
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    return (
      <Card ref={ref} className={cn("flex flex-col h-full border-border-default hover:border-accent/30 transition-all duration-300 group overflow-hidden bg-elevated", className)} {...props}>
        <div className="p-8 pb-6 border-b border-border-default/50 flex-grow">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <Badge variant="outline" className="text-xs uppercase tracking-wider font-mono border-accent/20 text-accent bg-accent/5">
              {category}
            </Badge>
            {difficulty && (
              <span className={cn(
                "px-2 py-0.5 text-xs font-mono font-bold rounded flex items-center gap-1 border",
                difficulty.toLowerCase() === 'advanced' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                difficulty.toLowerCase() === 'intermediate' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                'bg-green-500/10 text-green-500 border-green-500/20'
              )}>
                {difficulty}
              </span>
            )}
          </div>
          
          <CardTitle className="text-2xl font-bold mb-4 text-primary group-hover:text-accent transition-colors flex items-start justify-between gap-4">
            <span className="leading-tight">{title}</span>
            <ArrowUpRight className="w-5 h-5 text-secondary shrink-0 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300 mt-1" />
          </CardTitle>
          
          <CardDescription className="text-base text-secondary leading-relaxed line-clamp-3">
            {description}
          </CardDescription>
        </div>

        <div className="p-6 pt-4 bg-base/30 mt-auto flex items-center justify-between border-t border-border-default/50">
          <div className="flex items-center gap-4 text-xs font-medium text-secondary">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> {formattedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> {readingTime}
            </span>
          </div>
          
          <Bookmark className="w-4 h-4 text-secondary/50 group-hover:text-accent transition-colors" />
        </div>
        
        <Link href={href} className="absolute inset-0 z-0 opacity-0" aria-label={`Read article: ${title}`}>
          Read Article
        </Link>
      </Card>
    );
  }
);

BlogCard.displayName = "BlogCard";
