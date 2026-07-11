import * as React from "react";
import Link from "next/link";
import { ArrowRight, Box, Award, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export interface RelatedContentProps {
  relatedProjects?: string[];
  relatedSkills?: string[];
  relatedServices?: string[];
  relatedDocuments?: string[];
}

export function RelatedContent({
  relatedProjects = [],
  relatedSkills = [],
  relatedServices = []
}: RelatedContentProps) {
  
  if (relatedProjects.length === 0 && relatedSkills.length === 0 && relatedServices.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-border-default pt-12 mt-16">
      <h3 className="text-xl font-bold text-primary mb-8">Related Ecosystem</h3>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Services */}
        {relatedServices.length > 0 && (
          <Card className="bg-base border-border-default h-full">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4 text-accent">
                <Briefcase className="w-5 h-5" />
                <h4 className="font-bold text-primary">Related Services</h4>
              </div>
              <ul className="space-y-3">
                {relatedServices.map(service => (
                  <li key={service}>
                    <Link href="/services" className="text-sm text-secondary hover:text-accent transition-colors flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 shrink-0 mt-0.5" />
                      {service}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Skills & Tech */}
        {relatedSkills.length > 0 && (
          <Card className="bg-base border-border-default h-full">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4 text-accent">
                <Award className="w-5 h-5" />
                <h4 className="font-bold text-primary">Key Technologies</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {relatedSkills.map(skill => (
                  <Badge key={skill} variant="outline" className="text-xs bg-elevated">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Projects */}
        {relatedProjects.length > 0 && (
          <Card className="bg-base border-border-default h-full">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4 text-accent">
                <Box className="w-5 h-5" />
                <h4 className="font-bold text-primary">Related Projects</h4>
              </div>
              <ul className="space-y-3">
                {relatedProjects.map(projectFile => {
                  const slug = projectFile.replace(/\.md$/, '');
                  // Create human readable title from slug
                  const title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                  return (
                    <li key={slug}>
                      <Link href={`/projects/${slug}`} className="text-sm text-secondary hover:text-accent transition-colors flex items-start gap-2">
                        <ArrowRight className="w-4 h-4 shrink-0 mt-0.5" />
                        {title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
