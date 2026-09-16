import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { RetrievedChunk } from './retriever';

type LocalDoc = {
  id: string;
  title: string;
  category: string;
  relPath: string;
  text: string;
  titleLower: string;
  textLower: string;
};

const SKIP_FILES = /(faq|glossary|rag-index|knowledgebase)\.md$/i;

class LocalKnowledgeIndex {
  private docs: LocalDoc[] = [];
  private loaded = false;
  private baseDir = path.resolve(process.cwd(), '../workspace/knowledge-base/markdown');

  ensureLoaded() {
    if (this.loaded) return;
    this.docs = this.crawl(this.baseDir);
    this.loaded = true;
  }

  search(query: string, limit = 4): RetrievedChunk[] {
    this.ensureLoaded();
    const STOP = new Set(['the','and','for','with','that','this','from','your','about','what','how','does','have','been','into','their','you']);
    const terms = query
      .toLowerCase()
      .replace(/[^\w\s-]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 2 && !STOP.has(t));

    if (terms.length === 0) return [];

    const scored = this.docs.map((doc) => {
      let score = 0;
      for (const term of terms) {
        if (doc.titleLower === term) score += 8;
        else if (doc.titleLower.includes(term)) score += 5;
        if (doc.relPath.toLowerCase().includes(term)) score += 4;
        if (doc.textLower.includes(term)) score += 1;
      }
      if (SKIP_FILES.test(doc.relPath) && !/faq|glossary/.test(query.toLowerCase())) {
        score -= 6;
      }
      return { doc, score };
    }).filter((row) => row.score > 0);

    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, limit).map((row, index) => ({
      chunkId: row.doc.id,
      documentId: row.doc.id,
      chunkText: this.excerpt(row.doc, terms),
      chunkNumber: 0,
      metadata: {
        title: row.doc.title,
        url: this.toUrl(row.doc.relPath),
        category: row.doc.category
      },
      score: row.score - index * 0.01
    }));
  }

  private excerpt(doc: LocalDoc, terms: string[]): string {
    const clean = doc.text.replace(/\s+/g, ' ').trim();
    const hit = terms.find((term) => doc.textLower.includes(term) && !doc.titleLower.includes(term));
    if (!hit) return clean.slice(0, 700);
    const idx = doc.textLower.indexOf(hit);
    const start = Math.max(0, idx - 80);
    return clean.slice(start, start + 700);
  }

  private toUrl(relPath: string): string {
    const slug = relPath.replace(/\\/g, '/').replace(/\.md$/, '').replace(/\/index$/, '');
    if (slug.startsWith('services/')) return `/${slug}`;
    if (slug.startsWith('projects/')) return `/projects/${slug.slice('projects/'.length)}`;
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
      const text = `${title}\n${data.description || ''}\n${content}`.replace(/```[\s\S]*?```/g, ' ');
      acc.push({
        id: relPath,
        title,
        category: String(data.category || 'general'),
        relPath,
        text,
        titleLower: title.toLowerCase(),
        textLower: text.toLowerCase()
      });
    }
    return acc;
  }
}

export const localKnowledgeIndex = new LocalKnowledgeIndex();
