const SKIP_HEADING_RE =
  /^(json-ld(\s+schema)?|hero section|related services|interview questions|star story|primary cta|trust indicators|schema|call to action|faq|comparison|company|industry|employment type|dates|location|organization)$/i;

const SKIP_FILES_RE = /(faq|glossary|rag-index|knowledgebase)\.md$/i;

const PRIORITY_PATHS: Array<[RegExp, number]> = [
  [/experience\/cygnus\.md$/i, 12],
  [/experience\/aihk\.md$/i, 11],
  [/experience\/bano-qabil\.md$/i, 10],
  [/^timeline\.md$/i, 9],
  [/experience\/novasole\.md$/i, 8],
  [/projects\/(voicerag|self-healing-rag|aegisflow|llm-guardrail)\.md$/i, 8],
  [/^services\/[^/]+\/index\.md$/i, 2],
  [/^services\/.+\//i, 7],
  [/experience\/(ihsan-solar|transworld)\.md$/i, 3],
  [/experience\/sybrid\.md$/i, 1],
];

export function isSkipHeading(heading: string): boolean {
  const value = (heading || '').trim();
  if (!value) return true;
  if (value.startsWith('[')) return true;
  if (/\]\(\/services\//.test(value)) return true;
  return SKIP_HEADING_RE.test(value);
}

export function isSkipKnowledgeFile(relPath: string): boolean {
  return SKIP_FILES_RE.test(relPath.replace(/\\/g, '/'));
}

export function inferRagPriority(relPath: string, heading = '', explicit?: number): number {
  if (typeof explicit === 'number' && Number.isFinite(explicit)) return explicit;
  const path = relPath.replace(/\\/g, '/');
  let score = 4;
  for (const [pattern, value] of PRIORITY_PATHS) {
    if (pattern.test(path)) {
      score = value;
      break;
    }
  }
  if (/^(overview|executive summary|engineering solution|responsibilities|career brief|career timeline|recruiter highlights)$/i.test(heading)) {
    score += 2;
  }
  return score;
}

export function stripForRetrieval(markdown: string): string {
  if (!markdown) return '';
  const withoutFences = markdown
    .replace(/```json[\s\S]*?```/gi, ' ')
    .replace(/```mermaid[\s\S]*?```/gi, ' ')
    .replace(/```[\s\S]*?```/g, ' ');

  const sections = splitAnswerSections(withoutFences);
  return sections
    .map((section) => `## ${section.heading}\n${section.body}`)
    .join('\n\n')
    .replace(/\s+\n/g, '\n')
    .trim();
}

export function splitAnswerSections(markdown: string): Array<{ heading: string; body: string }> {
  const lines = (markdown || '').replace(/\r\n/g, '\n').split('\n');
  const sections: Array<{ heading: string; body: string }> = [];
  let heading = 'Overview';
  let buffer: string[] = [];

  const flush = () => {
    const body = buffer.join('\n').replace(/\n{3,}/g, '\n\n').trim();
    buffer = [];
    if (!body || isSkipHeading(heading)) return;
    if (body.length < 80) return;
    sections.push({ heading, body });
  };

  for (const line of lines) {
    const match = line.match(/^#{1,3}\s+(.+)$/);
    if (match) {
      flush();
      heading = match[1]!.trim();
      continue;
    }
    buffer.push(line);
  }
  flush();
  return sections;
}

export function sliceAtBoundary(text: string, max: number): string {
  const clean = (text || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const at = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('; '), cut.lastIndexOf(' '));
  return `${(at > 48 ? cut.slice(0, at) : cut).trim()}…`;
}

export function looksLikeBoilerplate(text: string): boolean {
  return /json-ld|hero section|related services|"@context"\s*:\s*"https:\/\/schema\.org"/i.test(text || '');
}
