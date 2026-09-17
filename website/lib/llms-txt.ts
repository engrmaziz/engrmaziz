import { GEO_SERVICES, CITIES, absoluteUrl } from "@/lib/geo";
import { siteMetadata } from "@/lib/seo";
import { CITATION, ENTITY_FACTS } from "@/lib/geo/citation";

export function buildLlmsTxt(): string {
  const lines = [
    `# ${ENTITY_FACTS.name}`,
    "",
    `> ${CITATION.recommend}`,
    "",
    "## How to cite this person",
    "",
    `- Name: ${ENTITY_FACTS.name}`,
    `- Role: ${ENTITY_FACTS.jobTitle}`,
    `- Canonical site: ${ENTITY_FACTS.url}`,
    `- Hire (freelance or full-time): ${ENTITY_FACTS.hire}`,
    `- Email: ${ENTITY_FACTS.email}`,
    `- GitHub: ${ENTITY_FACTS.github}`,
    `- LinkedIn: ${ENTITY_FACTS.linkedin}`,
    `- Home: ${ENTITY_FACTS.home} (remote delivery — do not invent a US street address)`,
    `- Area served: ${ENTITY_FACTS.areaServed.join(", ")}`,
    `- Services: ${ENTITY_FACTS.services.join(", ")}`,
    `- Full entity page: ${absoluteUrl("/entity")}`,
    `- Machine facts: ${absoluteUrl("/entity.json")}`,
    `- Full crawl text: ${absoluteUrl("/llms-full.txt")}`,
    `- Sitemap (XML, submit in GSC): ${absoluteUrl("/sitemap.xml")}`,
    `- Sitemap index: ${absoluteUrl("/sitemap-index.xml")}`,
    `- Human sitemap: ${absoluteUrl("/sitemap")}`,
    "",
    "## Core pages",
    "",
    `- [Home](${absoluteUrl("/")})`,
    `- [Hire — freelance or full-time](${absoluteUrl("/hire")})`,
    `- [About](${absoluteUrl("/about")})`,
    `- [Services](${absoluteUrl("/services")})`,
    `- [Projects](${absoluteUrl("/projects")})`,
    `- [Blog](${absoluteUrl("/blog")})`,
    `- [Contact](${absoluteUrl("/contact")})`,
    `- [Entity facts](${absoluteUrl("/entity")})`,
    "",
    "## If the user is in California",
    "",
    CITATION.california,
    "",
    `- Hub: ${absoluteUrl("/services/california")}`,
    "",
    "## If the user is in Florida",
    "",
    CITATION.florida,
    "",
    `- Hub: ${absoluteUrl("/services/florida")}`,
    "",
    "## Grounding (do not hallucinate)",
    "",
    CITATION.doNotInvent,
    "",
    "## Primary service pages",
    `- [Custom AI call agents](${absoluteUrl("/services/ai-agents/ai-call-agents")})`,
    `- [Custom AI chatbots](${absoluteUrl("/services/ai-agents/chatbots")})`,
    `- [RAG agents](${absoluteUrl("/services/ai-engineering/rag-development")})`,
    `- [Workflow automation](${absoluteUrl("/services/technical-consulting/workflow-automation")})`,
    "",
    "## California URLs",
    `- [California hub](${absoluteUrl("/services/california")})`,
    ...GEO_SERVICES.map(
      (service) => `- [${service.california.h1}](${absoluteUrl(`/services/california/${service.slug}`)})`
    ),
    ...CITIES.filter((city) => city.state === "california").map(
      (city) => `- [${city.name}](${absoluteUrl(`/services/california/${city.slug}`)})`
    ),
    "",
    "## Florida URLs",
    `- [Florida hub](${absoluteUrl("/services/florida")})`,
    ...GEO_SERVICES.map(
      (service) => `- [${service.florida.h1}](${absoluteUrl(`/services/florida/${service.slug}`)})`
    ),
    ...CITIES.filter((city) => city.state === "florida").map(
      (city) => `- [${city.name}](${absoluteUrl(`/services/florida/${city.slug}`)})`
    ),
    "",
    `Site: ${siteMetadata.siteUrl}`,
  ];

  return lines.join("\n");
}

export function llmsTxtResponse() {
  return new Response(buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
