import { getProjectSlugs, getProjectBySlug } from "@/lib/projects";
import { ProjectDetailLayout } from "@/components/project/ProjectDetailLayout";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

// Generate static routes for all projects at build time
export function generateStaticParams() {
  const slugs = getProjectSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

// Generate dynamic SEO metadata for each project case study
export function generateMetadata({ params }: ProjectPageProps): Metadata {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  const url = `https://musharrafaziz.com/projects/${project.slug}`;

  return {
    title: `${project.title} | Engineering Case Study | Musharraf Aziz`,
    description: project.description,
    keywords: project.keywords || null,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${project.title} | Engineering Case Study`,
      description: project.description,
      url: url,
      type: "article",
      ...(project.created && { publishedTime: project.created }),
      ...(project.updated && { modifiedTime: project.updated }),
      ...(project.tags && { tags: project.tags }),
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
    },
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  // Create JSON-LD structured data for the specific project case study
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${project.title} | Engineering Case Study`,
    "description": project.description,
    "url": `https://musharrafaziz.com/projects/${project.slug}`,
    "author": {
      "@type": "Person",
      "name": "Musharraf Aziz",
      "url": "https://musharrafaziz.com/about"
    },
    "datePublished": project.created,
    "dateModified": project.updated || project.created,
    "keywords": project.keywords?.join(", "),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://musharrafaziz.com/projects/${project.slug}`
    }
  };

  // Breadcrumb Schema
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Projects",
        "item": "https://musharrafaziz.com/projects"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": project.title,
        "item": `https://musharrafaziz.com/projects/${project.slug}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <ProjectDetailLayout project={project} />
    </>
  );
}
