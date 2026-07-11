/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-function-type */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const projectsDirectory = path.join(process.cwd(), '../workspace/knowledge-base/markdown/projects');

export interface ProjectData {
  slug: string;
  title: string;
  category: string;
  description: string;
  aliases?: string[] | undefined;
  tags?: string[] | undefined;
  keywords?: string[] | undefined;
  created?: string | undefined;
  updated?: string | undefined;
  version?: string | undefined;
  confidence?: string | undefined;
  related_documents?: string[] | undefined;
  related_projects?: string[] | undefined;
  related_skills?: string[] | undefined;
  related_services?: string[] | undefined;
  
  // Custom mapped fields
  sourceCode?: string | undefined;
  demoUrl?: string | undefined;
  status?: string | undefined;
  featured?: boolean | undefined;
  businessImpact?: string | undefined;
  readingTime?: string | undefined;
  
  // Markdown content
  content: string;
  
  // Sections map for the 33-section layout
  sections: Record<string, string>;
}

export function getProjectSlugs() {
  if (!fs.existsSync(projectsDirectory)) {
    return [];
  }
  return fs.readdirSync(projectsDirectory)
    .filter(file => file.endsWith('.md'))
    .map(file => file.replace(/\.md$/, ''));
}

export function getProjectBySlug(slug: string): ProjectData | null {
  const fullPath = path.join(projectsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the project metadata section
  const { data, content } = matter(fileContents);

  // Extract source code link from markdown content if present
  // e.g. **Source Code:** [GitHub Repository](https://github.com/...)
  const sourceMatch = content.match(/\*\*Source Code:\*\*\s*\[.*\]\((.*)\)/i);
  const sourceCode = sourceMatch ? sourceMatch[1] : undefined;

  // Extract sections from markdown body using headings
  // This is a naive parser that extracts content between ## Headings
  const sections: Record<string, string> = {};
  const tokens = content.split(/(?=^##\s+)/m);
  
  tokens.forEach(token => {
    const lines = token.trim().split('\n');
    const firstLine = lines[0]?.trim();
    if (!firstLine) return;

    if (firstLine.startsWith('## ')) {
      const heading = firstLine.replace(/^##\s+/, '').trim();
      const body = lines.slice(1).join('\n').trim();
      sections[heading] = body;
    } else if (firstLine.startsWith('# ')) {
       // This is the main title which we can ignore as it's in frontmatter
    } else if (!firstLine.startsWith('#')) {
       // preamble
       if (!sections['Overview']) {
         sections['Overview'] = token.trim();
       }
    }
  });

  return {
    slug,
    title: data.title || '',
    category: data.category || '',
    description: data.description || '',
    aliases: data.aliases || [],
    tags: data.tags || [],
    keywords: data.keywords || [],
    created: data.created,
    updated: data.updated,
    version: data.version,
    confidence: data.confidence,
    related_documents: data.related_documents || [],
    related_projects: data.related_projects || [],
    related_skills: data.related_skills || [],
    related_services: data.related_services || [],
    sourceCode,
    demoUrl: data.demoUrl,
    status: data.status || 'Completed',
    featured: data.featured || false,
    businessImpact: data.businessImpact || '',
    readingTime: '5 min read',
    content,
    sections
  };
}

export function getAllProjects(): ProjectData[] {
  const slugs = getProjectSlugs();
  const projects = slugs
    .map((slug) => getProjectBySlug(slug))
    .filter((project): project is ProjectData => project !== null)
    // sort projects by date (newest first)
    .sort((project1, project2) => {
      const date1 = project1.created ? new Date(project1.created).getTime() : 0;
      const date2 = project2.created ? new Date(project2.created).getTime() : 0;
      return date2 - date1;
    });
  return projects;
}
