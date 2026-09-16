const INJECTION_RE = [
  /ignore\s+(all\s+)?(previous|prior|above|earlier)\s+(instructions|prompts|rules)/i,
  /\byou are now\b/i,
  /\b(system|developer)\s+prompt\b/i,
  /\bjailbreak\b/i,
  /\bbypass\s+(your\s+)?(rules|guardrails|filters|safety)\b/i,
  /\breveal\s+.{0,40}(system|hidden)\s+prompt\b/i,
  /\bdo not follow\s+(your|the)\s+(instructions|rules)\b/i,
  /\bnew\s+(persona|role|instructions)\s*:/i,
];

export function containsPromptInjection(text: string): boolean {
  const value = String(text || "");
  if (!value.trim()) return false;
  return INJECTION_RE.some((re) => re.test(value));
}

export function sanitizeVisitorField(value: string, max = 80): string {
  return String(value || "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export function sanitizeVisitor(visitor: { name: string; email: string }): { name: string; email: string } {
  return {
    name: sanitizeVisitorField(visitor.name, 80),
    email: sanitizeVisitorField(visitor.email, 120).toLowerCase(),
  };
}

export function sanitizeClientMessages(raw: unknown, limit = 16): Array<{ role: "user" | "assistant"; content: string }> {
  if (!Array.isArray(raw)) return [];
  const out: Array<{ role: "user" | "assistant"; content: string }> = [];
  for (const item of raw.slice(-limit)) {
    if (!item || (item.role !== "user" && item.role !== "assistant")) continue;
    const content = sanitizeVisitorField(String(item.content || ""), 1600);
    if (!content) continue;
    out.push({ role: item.role, content });
  }
  return out;
}

export function sanitizeHref(href: unknown): string | undefined {
  if (typeof href !== "string") return undefined;
  const value = href.trim();
  if (!value || value.length > 500) return undefined;
  if (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")) return value;
  try {
    const url = new URL(value);
    if (url.protocol === "http:" || url.protocol === "https:" || url.protocol === "mailto:") {
      return url.href;
    }
  } catch {
    return undefined;
  }
  return undefined;
}

export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
