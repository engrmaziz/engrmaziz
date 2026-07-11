import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Calendar, Clock } from "lucide-react";

export interface ArticleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  excerpt: string;
  date: string;
  readingTime?: string;
  category?: string;
  href: string;
}

export const ArticleCard = React.forwardRef<HTMLDivElement, ArticleCardProps>(
  ({ className, title, excerpt, date, readingTime, category, href, ...props }, ref) => {
    return (
      <Link href={href} className={cn("block h-full outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xl", className)}>
        <Card ref={ref} interactive className="h-full border-transparent bg-transparent hover:bg-elevated transition-colors" {...props}>
          <CardHeader className="p-0 sm:p-6 sm:pb-0">
            {category && (
              <span className="text-xs font-mono font-medium text-accent uppercase tracking-widest mb-2 block">
                {category}
              </span>
            )}
            <CardTitle className="text-2xl group-hover:text-accent transition-colors">{title}</CardTitle>
            <CardDescription className="line-clamp-3 mt-3 text-base">{excerpt}</CardDescription>
          </CardHeader>
          <CardFooter className="mt-auto p-0 sm:p-6 pt-4 sm:pt-4">
            <div className="flex items-center gap-4 text-xs text-secondary">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <time dateTime={date}>{date}</time>
              </div>
              {readingTime && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{readingTime}</span>
                </div>
              )}
            </div>
          </CardFooter>
        </Card>
      </Link>
    );
  }
);

ArticleCard.displayName = "ArticleCard";
