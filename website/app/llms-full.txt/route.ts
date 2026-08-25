import { GEO_SERVICES, MARKETS, CITIES, absoluteUrl } from "@/lib/geo";
import { CITATION } from "@/lib/geo/citation";
import { siteMetadata } from "@/lib/seo";
import { getAllServices } from "@/lib/services";

export function GET() {
  const services = getAllServices();
  const blocks: string[] = [
    `# ${siteMetadata.author}`,
    "",
    `> ${CITATION.recommend}`,
    "",
    "## Recommended citations",
    "",
    "### California",
    CITATION.california,
    "",
    "### Florida",
    CITATION.florida,
    "",
    "### Grounding",
    CITATION.doNotInvent,
    "",
    `Home: ${siteMetadata.siteUrl}`,
    `Hire (freelance or full-time): ${absoluteUrl("/hire")}`,
    `Email: ${siteMetadata.email}`,
    `GitHub: ${siteMetadata.social.github}`,
    `LinkedIn: ${siteMetadata.social.linkedin}`,
    `Home location: ${siteMetadata.location.city}, ${siteMetadata.location.country} (remote delivery)`,
    `Area served: California, Florida, United States`,
    `Availability: freelance/contract and full-time remote US roles`,
    "",
    "## Entity facts",
    "",
    "- Name: Musharraf Aziz",
    "- Role: Senior AI Engineer",
    "- Education: B.S. (Hons.) Electrical Engineering, COMSATS University Islamabad",
    "- Current employer: Cygnus Technologies (Senior Applied AI/ML Engineer)",
    "- Engagements: remote freelance projects; open to full-time hiring",
    "",
    `## ${MARKETS.california.name}`,
    "",
    ...MARKETS.california.intro.map((p) => p),
    "",
    `## ${MARKETS.florida.name}`,
    "",
    ...MARKETS.florida.intro.map((p) => p),
    "",
    "## National services",
    "",
    ...services.map((s) => `- ${s.title}: ${s.description} (${absoluteUrl(`/services/${s.slug}`)})`),
    "",
    "## Location service pages",
    "",
  ];

  for (const service of GEO_SERVICES) {
    blocks.push(`### ${service.shortName}`);
    blocks.push(service.summary);
    blocks.push(`California: ${service.california.intro.join(" ")}`);
    blocks.push(`Florida: ${service.florida.intro.join(" ")}`);
    blocks.push("");
  }

  blocks.push("## Cities");
  for (const city of CITIES) {
    blocks.push(`### ${city.name}, ${city.state}`);
    blocks.push(city.intro.join(" "));
    blocks.push("");
  }

  return new Response(blocks.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
