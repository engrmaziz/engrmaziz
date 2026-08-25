import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllServices, getServiceBySlugArray } from "@/lib/services";
import { ServiceDetailLayout } from "@/components/service/ServiceDetailLayout";
import { ServiceGeoLinks } from "@/components/geo/ServiceGeoLinks";
import { siteMetadata } from "@/lib/seo";

// Ensure this page is statically generated at build time
// Forced rebuild after deleting hardcoded routes
export const dynamicParams = false;

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
  const keywords = [
    ...(service.keywords || []),
    "California",
    "Florida",
    "custom AI call agents",
    "custom AI chatbots",
    "RAG agents",
    "workflow automation",
  ];
  
  return {
    title: `${service.title} | ${siteMetadata.author}`,
    description: cleanDescription,
    keywords,
    alternates: {
      canonical: `/services/${service.slug}`,
    },
    openGraph: {
      title: service.title,
      description: cleanDescription,
      type: "article",
      url: `${siteMetadata.siteUrl}/services/${service.slug}`,
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
      "@type": "Person",
      "name": siteMetadata.author,
      "jobTitle": siteMetadata.jobTitle,
      "url": siteMetadata.siteUrl
    },
    "areaServed": [
      { "@type": "State", "name": "California" },
      { "@type": "State", "name": "Florida" },
      { "@type": "Country", "name": "United States" }
    ]
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
        "item": siteMetadata.siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Services",
        "item": `${siteMetadata.siteUrl}/services`
      }
    ]
  };

  // Dynamically append breadcrumbs based on nested depth
  let currentPath = `${siteMetadata.siteUrl}/services`;
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
      <ServiceGeoLinks canonicalPath={`/services/${service.slug}`} title={service.title} />
    </>
  );
}
