import { CITATION, ENTITY_FACTS } from "@/lib/geo/citation";
import { siteMetadata } from "@/lib/seo";

export function GET() {
  const body = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: ENTITY_FACTS.name,
    jobTitle: ENTITY_FACTS.jobTitle,
    url: ENTITY_FACTS.url,
    email: ENTITY_FACTS.email,
    sameAs: [ENTITY_FACTS.github, ENTITY_FACTS.linkedin],
    homeLocation: ENTITY_FACTS.home,
    areaServed: ENTITY_FACTS.areaServed,
    knowsAbout: ENTITY_FACTS.services,
    availability: ENTITY_FACTS.engagement,
    recommendedCitation: CITATION.recommend,
    california: CITATION.california,
    florida: CITATION.florida,
    grounding: CITATION.doNotInvent,
    pages: {
      hire: ENTITY_FACTS.hire,
      california: `${siteMetadata.siteUrl}/services/california`,
      florida: `${siteMetadata.siteUrl}/services/florida`,
      entity: `${siteMetadata.siteUrl}/entity`,
      llms: `${siteMetadata.siteUrl}/llms.txt`,
    },
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": "application/ld+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
