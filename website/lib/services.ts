/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-function-type */
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const SERVICES_DIR = path.join(process.cwd(), "..", "workspace", "knowledge-base", "markdown", "services");

export interface BaseContent {
  slug: string;
  slugArray: string[];
  title: string;
  category: string;
  description: string;
  aliases?: string[];
  tags?: string[];
  keywords?: string[];
  created?: string;
  updated?: string;
  version?: string;
  confidence?: string;
  related_documents?: string[];
  related_projects?: string[];
  related_skills?: string[];
  related_services?: string[];
  sections: Record<string, string>;
}

export interface Service extends BaseContent {
  parent: string;
}

export interface Pillar extends BaseContent {
  children: Service[];
}

export type AnyServiceContent = Pillar | Service;

function walkDir(dir: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(file));
    } else {
      if (file.endsWith(".md")) {
        results.push(file);
      }
    }
  });
  return results;
}

function parseMarkdownFile(filePath: string): BaseContent {
  // Determine relative path from SERVICES_DIR
  const relativePath = path.relative(SERVICES_DIR, filePath);
  // Convert backslashes to forward slashes for URLs
  const normalizedPath = relativePath.replace(/\\/g, '/');
  
  const slugArray = normalizedPath.replace(/\.md$/, '').split('/');
  if (slugArray[slugArray.length - 1] === 'index') {
    slugArray.pop();
  }
  
  const slug = slugArray.join('/');

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  // Parse sections based on headings
  const sections: Record<string, string> = {};
  const tokens = content.split('\n## ');
  
  tokens.forEach(token => {
    const lines = token.trim().split('\n');
    const firstLine = lines[0]?.trim();
    if (!firstLine) return;

    if (firstLine.startsWith('## ')) {
      const heading = firstLine.replace(/^##\s+/, '').trim();
      const body = lines.slice(1).join('\n').trim();
      sections[heading] = body;
    } else if (firstLine.startsWith('# ')) {
       // Main title ignore
    } else if (!firstLine.startsWith('#')) {
       const heading = firstLine.trim();
       const body = lines.slice(1).join('\n').trim();
       if (heading) {
         sections[heading] = body;
       }
    }
  });

  if (tokens.length > 0 && tokens[0]) {
    const firstChunkLines = tokens[0].trim().split('\n');
    if (firstChunkLines[0]?.startsWith('# ')) {
       const body = firstChunkLines.slice(1).join('\n').trim();
       if (body && !sections['Overview']) {
         sections['Overview'] = body;
       }
    }
  }

  return {
    slug,
    slugArray,
    title: data.title || slug.replace(/-/g, ' '),
    category: data.category || 'Service',
    description: data.description || 'Information Required',
    aliases: data.aliases || undefined,
    tags: data.tags || undefined,
    keywords: data.keywords || undefined,
    created: data.created || undefined,
    updated: data.updated || undefined,
    version: data.version || undefined,
    confidence: data.confidence || undefined,
    related_documents: data.related_documents || undefined,
    related_projects: data.related_projects || undefined,
    related_skills: data.related_skills || undefined,
    related_services: data.related_services || undefined,
    sections
  };
}

export function getAllServices(): AnyServiceContent[] {
  const markdownFiles = walkDir(SERVICES_DIR);
  
  const allParsed = markdownFiles.map(parseMarkdownFile);
  
  const pillarsRaw = allParsed.filter(p => p.slugArray.length === 1);
  const childrenRaw = allParsed.filter(p => p.slugArray.length > 1);
  
  const services: Service[] = childrenRaw.map(c => ({
    ...c,
    parent: c.slugArray[0] || ''
  }));

  const pillars: Pillar[] = pillarsRaw.map(p => ({
    ...p,
    children: services.filter(s => s.parent === p.slugArray[0])
  }));

  return [...pillars, ...services];
}

export function getPillars(): Pillar[] {
  const allContent = getAllServices();
  return allContent.filter((c): c is Pillar => c.slugArray.length === 1);
}

export function getServiceBySlugArray(slugArray: string[]): AnyServiceContent | null {
  const allContent = getAllServices();
  const targetSlug = slugArray.join('/');
  return allContent.find(c => c.slug === targetSlug) || null;
}
