import * as React from "react";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ArrowUpRight, GitBranch, ExternalLink, Code2, Clock, Target } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ProjectCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  category: string;
  status?: string | undefined;
  techStack?: string[] | undefined;
  githubUrl?: string | undefined;
  liveUrl?: string | undefined;
  href: string;
  featured?: boolean | undefined;
  businessImpact?: string | undefined;
  readingTime?: string | undefined;
}

export const ProjectCard = React.forwardRef<HTMLDivElement, ProjectCardProps>(
  ({ 
    className, 
    title, 
    description, 
    category,
    status = "Completed",
    techStack = [],
    githubUrl,
    liveUrl,
    href,
    featured = false,
    businessImpact,
    readingTime = "5 min read",
    ...props 
  }, ref) => {
    
    // Status color mapping
    const getStatusColor = (s: string) => {
      switch (s.toLowerCase()) {
        case 'active':
        case 'in production':
        case 'completed':
          return 'bg-green-500/10 text-green-500 border-green-500/20';
        case 'in progress':
        case 'beta':
          return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
        case 'archived':
          return 'bg-secondary/10 text-secondary border-secondary/20';
        default:
          return 'bg-secondary/10 text-secondary border-secondary/20';
      }
    };

    return (
      <Card ref={ref} className={cn("flex flex-col h-full border-border-default hover:border-accent/30 transition-all duration-300 group overflow-hidden bg-elevated", className)} {...props}>
        
        {/* Header Section */}
        <div className="p-6 pb-4 border-b border-border-default/50">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="text-xs uppercase tracking-wider font-mono border-accent/20 text-accent bg-accent/5">
                {category}
              </Badge>
              {featured && (
                <Badge variant="accent" className="text-xs uppercase tracking-wider font-mono">
                  Featured
                </Badge>
              )}
            </div>
            <div className={cn("px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border flex items-center gap-1.5", getStatusColor(status))}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {status}
            </div>
          </div>
          
          <CardTitle className="text-xl md:text-2xl font-bold mb-2 text-primary group-hover:text-accent transition-colors flex items-center justify-between">
            {title}
            <ArrowUpRight className="w-5 h-5 text-secondary opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
          </CardTitle>
          
          <CardDescription className="text-sm text-secondary leading-relaxed line-clamp-2">
            {description}
          </CardDescription>
        </div>

        {/* Content Section */}
        <div className="p-6 pt-4 flex-grow flex flex-col gap-4 bg-base/30">
          {businessImpact && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-green-500/5 border border-green-500/10">
              <Target className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
              <p className="text-xs text-green-700 dark:text-green-400 font-medium leading-relaxed">
                {businessImpact}
              </p>
            </div>
          )}
          
          <div className="mt-auto">
            <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-secondary" />
              Core Stack
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {techStack.slice(0, 4).map((tech) => (
                <span key={tech} className="px-2 py-1 bg-elevated border border-border-default rounded text-xs font-mono text-secondary">
                  {tech}
                </span>
              ))}
              {techStack.length > 4 && (
                <span className="px-2 py-1 bg-elevated border border-border-default rounded text-xs font-mono text-secondary">
                  +{techStack.length - 4}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border-default/50 bg-elevated flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-secondary font-medium">
            <Clock className="w-3.5 h-3.5" />
            {readingTime}
          </div>
          
          <div className="flex items-center gap-3">
            {githubUrl && (
              <a 
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:text-primary transition-colors flex items-center gap-1 text-sm font-medium z-10 relative"
                onClick={(e) => e.stopPropagation()}
              >
                <GitBranch className="w-4 h-4" />
                <span className="sr-only md:not-sr-only md:ml-1">Source</span>
              </a>
            )}
            
            {liveUrl && (
              <a 
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:text-primary transition-colors flex items-center gap-1 text-sm font-medium z-10 relative"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-4 h-4" />
                <span className="sr-only md:not-sr-only md:ml-1">Demo</span>
              </a>
            )}

            <Link href={href} className="ml-2 z-10 relative">
              <span className="inline-flex items-center justify-center px-4 py-1.5 text-xs font-bold bg-primary text-base-inverted rounded-full hover:bg-accent hover:text-white transition-colors">
                Read Case Study
              </span>
            </Link>
          </div>
        </div>
        
        {/* Make the whole card clickable but preserve nested links */}
        <Link href={href} className="absolute inset-0 z-0 opacity-0" aria-label={`Read case study for ${title}`}>
          Read Case Study
        </Link>
      </Card>
    );
  }
);

ProjectCard.displayName = "ProjectCard";
