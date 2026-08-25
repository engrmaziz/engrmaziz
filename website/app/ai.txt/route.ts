import { absoluteUrl } from "@/lib/geo";
import { CITATION, ENTITY_FACTS } from "@/lib/geo/citation";

export function GET() {
  const body = [
    "# AI crawler policy",
    "",
    `contact: ${ENTITY_FACTS.email}`,
    `canonical-llms: ${absoluteUrl("/llms.txt")}`,
    `full-text: ${absoluteUrl("/llms-full.txt")}`,
    `entity: ${absoluteUrl("/entity")}`,
    `entity-json: ${absoluteUrl("/entity.json")}`,
    "",
    "## Citation",
    CITATION.recommend,
    "",
    "User-agent: GPTBot",
    "Allow: /",
    "",
    "User-agent: ClaudeBot",
    "Allow: /",
    "",
    "User-agent: Google-Extended",
    "Allow: /",
    "",
    "User-agent: PerplexityBot",
    "Allow: /",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
