/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-function-type */
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "..", "workspace", "knowledge-base", "markdown", "blog");

export interface BlogData {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  author: string;
  readingTime: string;
  difficulty?: string;
  tags?: string[];
  
  // SEO & Meta
  featured?: boolean;
  coverImage?: string;
  
  // Relations
  related_projects?: string[];
  related_services?: string[];
  
  // Content
  content: string;
  sections: Record<string, string>;
}

export function getAllPosts(): BlogData[] {
  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR, { recursive: true });
    return [];
  }

  const files = fs.readdirSync(BLOG_DIR);
  const markdownFiles = files.filter(f => f.endsWith(".md"));

  const posts = markdownFiles.map(filename => {
    const filePath = path.join(BLOG_DIR, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const slug = filename.replace(/\.md$/, "");

    const { data, content } = matter(fileContent);

    // Basic section parsing for TOC
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
      title: data.title || slug.replace(/-/g, ' '),
      description: data.description || '',
      category: data.category || 'Engineering',
      date: data.date || new Date().toISOString().split('T')[0],
      author: data.author || 'Senior Software Architect',
      readingTime: data.readingTime || '5 min read',
      difficulty: data.difficulty || undefined,
      tags: data.tags || [],
      featured: data.featured || false,
      coverImage: data.coverImage || undefined,
      related_projects: data.related_projects || [],
      related_services: data.related_services || [],
      content,
      sections
    };
  });

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogData | null {
  const posts = getAllPosts();
  return posts.find(p => p.slug === slug) || null;
}
