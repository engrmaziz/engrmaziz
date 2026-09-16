import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { classifyRagIntent } from './identity';
import {
  inferRagPriority,
  isSkipKnowledgeFile,
  sliceAtBoundary,
  splitAnswerSections,
  stripForRetrieval,
} from './knowledge-clean';
import { RetrievedChunk } from './retriever';

type LocalDoc = {
  id: string;
  title: string;
  heading: string;
  category: string;
  relPath: string;
  text: string;
  titleLower: string;
  textLower: string;
  priority: number;
};

const EARLY_OPS = /ihsan-solar|transworld|sybrid/;

class LocalKnowledgeIndex {
  private docs: LocalDoc[] = [];
  private loaded = false;
  private baseDir = path.resolve(process.cwd(), '../workspace/knowledge-base/markdown');

  ensureLoaded() {
    if (this.loaded) return;
    this.docs = this.crawl(this.baseDir);
    this.loaded = true;
  }

  search(query: string, limit = 6): RetrievedChunk[] {
    this.ensureLoaded();
    const STOP = new Set(['the','and','for','with','that','this','from','your','about','what','how','does','have','been','into','their','you','are','was','can','his','her']);
    const intent = classifyRagIntent(query);
    const terms = query
      .toLowerCase()
      .replace(/[^\w\s-]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 2 && !STOP.has(t));

    if (terms.length === 0) return [];

    const scored = this.docs.map((doc) => {
      let score = doc.priority * 0.35;
      for (const term of terms) {
        if (intent === 'services' && term === 'services') {
          if (doc.relPath.startsWith('services/')) score += 1;
          continue;
        }
        if (doc.titleLower === term) score += 8;
        else if (doc.titleLower.includes(term)) score += 5;
        if (doc.heading.toLowerCase().includes(term)) score += 3;
        if (doc.relPath.toLowerCase().includes(term)) score += 4;
        if (doc.textLower.includes(term)) score += 1;
      }

      if (intent === 'experience') {
        if (doc.relPath.startsWith('experience/') || doc.relPath === 'timeline.md') score += 5;
        if (/career brief|overview|responsibilities|recruiter highlights/i.test(doc.heading)) score += 4;
        if (EARLY_OPS.test(doc.relPath) && !EARLY_OPS.test(query.toLowerCase())) score -= 12;
      }

      if (intent === 'services') {
        if (doc.relPath.startsWith('services/') && !/\/index\.md$/.test(doc.relPath)) score += 5;
        if (/^services\/ai-agents\//.test(doc.relPath) || /rag-development|llm-orchestration/.test(doc.relPath)) score += 6;
        if (/ai-call-agents|\/chatbots\.md|rag-development|voice-agents|whatsapp/.test(doc.relPath)) score += 3;
        if (/executive summary|engineering solution|our solution|business problems?/i.test(doc.heading)) score += 4;
      }

      if (intent === 'identity' || intent === 'hire') {
        if (doc.relPath === 'timeline.md' || /experience\/(cygnus|aihk|bano-qabil)\.md/.test(doc.relPath)) score += 4;
      }

      if (isSkipKnowledgeFile(doc.relPath) && !/faq|glossary/.test(query.toLowerCase())) {
        score -= 8;
      }

      return { doc, score };
    }).filter((row) => row.score > 1.5);

    scored.sort((a, b) => b.score - a.score);

    const seenFiles = new Map<string, number>();
    const picked: typeof scored = [];
    const perFileCap = intent === 'experience' || intent === 'identity' ? 1 : 2;
    for (const row of scored) {
      const fileCount = seenFiles.get(row.doc.relPath) || 0;
      if (fileCount >= perFileCap) continue;
      seenFiles.set(row.doc.relPath, fileCount + 1);
      picked.push(row);
      if (picked.length >= limit) break;
    }

    return picked.map((row, index) => ({
      chunkId: row.doc.id,
      documentId: row.doc.relPath,
      chunkText: sliceAtBoundary(row.doc.text, 900),
      chunkNumber: 0,
      metadata: {
        title: row.doc.title,
        heading: row.doc.heading,
        url: this.toUrl(row.doc.relPath),
        category: row.doc.category
      },
      score: row.score - index * 0.01
    }));
  }

  private toUrl(relPath: string): string {
    const slug = relPath.replace(/\\/g, '/').replace(/\.md$/, '').replace(/\/index$/, '');
    if (slug.startsWith('services/')) return `/${slug}`;
    if (slug.startsWith('projects/')) return `/projects/${slug.slice('projects/'.length)}`;
    if (slug.startsWith('experience/') || slug === 'timeline') return '/about';
    return `/${slug}`;
  }

  private crawl(dir: string, acc: LocalDoc[] = []): LocalDoc[] {
    if (!fs.existsSync(dir)) return acc;
    for (const file of fs.readdirSync(dir)) {
      const full = path.join(dir, file);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        this.crawl(full, acc);
        continue;
      }
      if (!file.endsWith('.md')) continue;
      const raw = fs.readFileSync(full, 'utf8');
      const { data, content } = matter(raw);
      const relPath = path.relative(this.baseDir, full).replace(/\\/g, '/');
      const title = String(data.title || path.basename(file, '.md'));
      const cleaned = stripForRetrieval(content);
      const sections = splitAnswerSections(cleaned);
      const explicit = typeof data.rag_priority === 'number' ? data.rag_priority : undefined;
      const category = String(data.category || 'general');

      const rows = sections.length
        ? sections
        : [{ heading: 'Overview', body: `${title}\n${data.description || ''}` }];

      for (const section of rows) {
        const text = section.body.trim();
        if (text.length < 80) continue;
        if (/github\.com/i.test(text) && text.length < 240) continue;
        acc.push({
          id: `${relPath}#${section.heading.toLowerCase().replace(/[^\w]+/g, '-')}`,
          title,
          heading: section.heading,
          category,
          relPath,
          text,
          titleLower: `${title} ${section.heading}`.toLowerCase(),
          textLower: text.toLowerCase(),
          priority: inferRagPriority(relPath, section.heading, explicit)
        });
      }
    }
    return acc;
  }
}

export const localKnowledgeIndex = new LocalKnowledgeIndex();
