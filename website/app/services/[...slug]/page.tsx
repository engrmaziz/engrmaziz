import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllServices, getServiceBySlugArray } from "@/lib/services";
import { ServiceDetailLayout } from "@/components/service/ServiceDetailLayout";

// Ensure this page is statically generated at build time
// Forced rebuild after deleting hardcoded routes
export function generateStaticParams() {
  const services = getAllServices();
  return services.map((service) => ({
    slug: service.slugArray,
  }));
}

export function generateMetadata({ params }: { params: { slug: string[] } }): Metadata {
  const service = getServiceBySlugArray(params.slug);
  
  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  const cleanDescription = service.description || `Engineering service details for ${service.title}`;
  
  return {
    title: `${service.title} | Engineering Services`,
    description: cleanDescription,
    openGraph: {
      title: service.title,
      description: cleanDescription,
      type: "article",
      tags: service.tags || [],
    },
    twitter: {
      card: "summary_large_image",
      title: service.title,
      description: cleanDescription,
    }
  };
}

export default function ServiceDetailPage({ params }: { params: { slug: string[] } }) {
  const service = getServiceBySlugArray(params.slug);

  if (!service) {
    notFound();
  }

  // Schema for service definition
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "description": service.description,
    "category": service.category,
    "provider": {
      "@type": "Organization",
      "name": "Senior Software Architect"
    }
  };

  // Breadcrumb schema
  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://maziz.me"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Services",
        "item": "https://maziz.me/services"
      }
    ]
  };

  // Dynamically append breadcrumbs based on nested depth
  let currentPath = "https://maziz.me/services";
  service.slugArray.forEach((part, index) => {
    currentPath += `/${part}`;
    breadcrumbList.itemListElement.push({
      "@type": "ListItem",
      "position": index + 3,
      "name": part.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      "item": currentPath
    });
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([serviceJsonLd, breadcrumbList]) }}
      />
      <ServiceDetailLayout service={service} />
    </>
  );
}
