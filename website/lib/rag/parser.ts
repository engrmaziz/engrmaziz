/* eslint-disable @typescript-eslint/no-explicit-any */
import matter from 'gray-matter';
import * as crypto from 'crypto';

export interface ParsedDocument {
  title: string;
  description: string;
  content: string;
  checksum: string;
  metadata: Record<string, any>;
  documentType: 'markdown' | 'pdf' | 'txt' | 'csv' | 'json' | 'web';
}

export class RAGParser {
  /**
   * Parse a document, cleaning Unicode, resolving frontmatter, and computing SHA-256 checksum.
   */
  parse(rawContent: string, filename: string, fileType: string = 'markdown'): ParsedDocument {
    // Normalize newlines and Unicode formatting
    const normalized = rawContent.normalize('NFKC').replace(/\r\n/g, '\n');

    // Calculate SHA-256 checksum for precise incremental indexing
    const checksum = crypto.createHash('sha256').update(normalized).digest('hex');

    if (fileType === 'markdown' || filename.endsWith('.md') || filename.endsWith('.mdx')) {
      const { data, content } = matter(normalized);

      // Clean markdown content by stripping empty lines at start/end
      const cleanedContent = content.trim();

      // Extract metadata values
      const title = data.title || this.extractTitleFromMarkdown(cleanedContent) || this.getFilenameWithoutExtension(filename);
      const description = data.description || '';
      const category = data.category || this.inferCategoryFromPath(filename);
      const slug = data.slug || this.deriveSlug(filename);
      const url = data.url || this.deriveUrl(category, slug, filename);
      const pillar = data.pillar || this.inferPillar(category, filename);

      const wordCount = cleanedContent.split(/\s+/).filter(Boolean).length;
      const readingTime = Math.max(1, Math.ceil(wordCount / 200)); // Estimated 200 WPM

      const parsedMeta: Record<string, any> = {
        title,
        description,
        slug,
        url,
        category,
        pillar,
        service: data.service || (category === 'services' ? title : null),
        project: data.project || (category === 'projects' ? title : null),
        tags: data.tags || [],
        keywords: data.keywords || [],
        version: data.version || '1.0.0',
        author: data.author || 'Musharraf Aziz',
        language: data.language || 'en',
        created_at: data.created || data.created_at || new Date().toISOString(),
        updated_at: data.updated || data.updated_at || new Date().toISOString(),
        reading_time: readingTime,
        checksum,
        source: filename.replace(/\\/g, '/'),
      };

      return {
        title,
        description,
        content: cleanedContent,
        checksum,
        metadata: parsedMeta,
        documentType: 'markdown'
      };
    }

    // Fallback parser for plain text
    const title = this.getFilenameWithoutExtension(filename);
    const category = this.inferCategoryFromPath(filename);
    const slug = this.deriveSlug(filename);
    const url = this.deriveUrl(category, slug, filename);

    return {
      title,
      description: '',
      content: normalized.trim(),
      checksum,
      metadata: {
        title,
        description: '',
        slug,
        url,
        category,
        pillar: 'General',
        service: null,
        project: null,
        tags: [],
        keywords: [],
        version: '1.0.0',
        author: 'Musharraf Aziz',
        language: 'en',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        reading_time: Math.max(1, Math.ceil(normalized.split(/\s+/).filter(Boolean).length / 200)),
        checksum,
        source: filename.replace(/\\/g, '/'),
      },
      documentType: 'txt'
    };
  }

  private extractTitleFromMarkdown(content: string): string | null {
    const match = content.match(/^#\s+(.+)$/m);
    return (match && match[1]) ? match[1].trim() : null;
  }

  private getFilenameWithoutExtension(filename: string): string {
    const base = filename.split(/[\\/]/).pop() || filename;
    return base.replace(/\.[^/.]+$/, "");
  }

  private deriveSlug(filename: string): string {
    const parts = filename.replace(/\\/g, '/').replace(/\.[^/.]+$/, "").split('/');
    // Check if filename is index.md or similar, get folder name instead
    const last = parts.pop() || '';
    if (last === 'index' && parts.length > 0) {
      return parts.pop() || last;
    }
    return last;
  }

  private deriveUrl(category: string, slug: string, filename: string): string {
    // Map categories to frontend routes
    const cleanSlug = slug.toLowerCase();
    const cleanFilename = filename.toLowerCase().replace(/\\/g, '/');
    
    if (category === 'blog' || cleanFilename.includes('/blog/')) return `/blog/${cleanSlug}`;
    if (category === 'projects' || cleanFilename.includes('/projects/')) return `/projects/${cleanSlug}`;
    if (category === 'services' || cleanFilename.includes('/services/')) {
      // Find sub-path structure inside services folder
      const serviceParts = cleanFilename.split('/services/');
      if (serviceParts.length > 1) {
        const subPath = serviceParts[1]!.replace(/\.[^/.]+$/, "");
        return `/services/${subPath.replace(/\/index$/, '')}`;
      }
      return `/services/${cleanSlug}`;
    }
    if (cleanSlug === 'about') return '/about';
    if (cleanSlug === 'timeline') return '/about#timeline';
    return `/${cleanSlug}`;
  }

  private inferCategoryFromPath(filename: string): string {
    const parts = filename.toLowerCase().replace(/\\/g, '/').split('/');
    if (parts.includes('experience')) return 'experience';
    if (parts.includes('certifications')) return 'certifications';
    if (parts.includes('education')) return 'education';
    if (parts.includes('projects')) return 'projects';
    if (parts.includes('services')) return 'services';
    if (parts.includes('blog')) return 'blog';
    if (parts.includes('skills')) return 'skills';
    return 'general';
  }

  private inferPillar(category: string, filename: string): string {
    const fn = filename.toLowerCase().replace(/\\/g, '/');
    if (fn.includes('ai-engineering') || fn.includes('ai-agents') || fn.includes('rag')) {
      return 'AI Engineering';
    }
    if (fn.includes('software-engineering') || fn.includes('backend') || fn.includes('frontend')) {
      return 'Software Engineering';
    }
    if (fn.includes('technical-consulting') || fn.includes('architecture-review') || fn.includes('feasibility')) {
      return 'Technical Consulting';
    }
    return 'General';
  }
}

export const ragParser = new RAGParser();
