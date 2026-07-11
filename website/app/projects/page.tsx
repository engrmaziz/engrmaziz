import * as React from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { ProjectsClient } from "@/components/project/ProjectsClient";
import { getAllProjects } from "@/lib/projects";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Engineering Projects | Musharraf Aziz",
  description: "Enterprise-grade AI systems, scalable backend architectures, and high-performance full-stack applications. Detailed technical case studies.",
  openGraph: {
    title: "Engineering Projects | Musharraf Aziz",
    description: "Enterprise-grade AI systems, scalable backend architectures, and high-performance full-stack applications.",
    type: "website",
  },
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  // Create JSON-LD structured data for the projects portfolio
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Engineering Projects | Musharraf Aziz",
    "description": "Enterprise-grade AI systems, scalable backend architectures, and high-performance full-stack applications.",
    "url": "https://musharrafaziz.com/projects",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": projects.map((project, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://musharrafaziz.com/projects/${project.slug}`,
        "name": project.title
      }))
    }
  };

  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProjectsClient initialProjects={projects} />
    </PageLayout>
  );
}
