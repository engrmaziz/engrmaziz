export function compactCta(label: string | undefined, fallback: string) {
  const raw = (label || fallback).replace(/\s+/g, " ").trim();
  if (!raw) return fallback;
  if (raw.length <= 26) return raw;

  const lower = raw.toLowerCase();
  if (lower.includes("case stud")) return "View case studies";
  if (lower.includes("review")) return "Book a review";
  if (lower.includes("audit")) return "Request an audit";
  if (lower.includes("demo")) return "See a demo";
  if (lower.includes("consultation") || lower.includes("advisory")) return "Book a call";
  if (lower.includes("discuss") || lower.includes("schedule")) return "Start a project";
  if (lower.includes("architect")) return "Discuss architecture";
  if (lower.includes("capabilit") || lower.includes("explore") || lower.includes("methodology")) {
    return "See capabilities";
  }
  return raw.split(" ").slice(0, 4).join(" ");
}
