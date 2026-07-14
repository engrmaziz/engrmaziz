/* eslint-disable @typescript-eslint/no-explicit-any */
export class RAGMetadata {
  private defaultTechStack = [
    'Next.js', 'FastAPI', 'Python', 'TypeScript', 'PostgreSQL', 
    'Supabase', 'Docker', 'Linux', 'GitHub Actions', 'LangGraph', 
    'LangChain', 'OpenAI', 'Groq', 'RAG', 'AI Engineering', 
    'Backend', 'Open Source', 'Three.js', 'WebSockets', 'n8n'
  ];

  /**
   * Scan text to extract a standard list of tech tags for indexing.
   */
  extractTags(content: string): string[] {
    return this.defaultTechStack.filter(tech => {
      const escapedTech = tech.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedTech}\\b`, 'i');
      return regex.test(content);
    });
  }

  /**
   * Formats a query filter object to match Supabase's JSONB query capabilities.
   * e.g., mapping target filters like { category: 'Project' } into JSONB schemas.
   */
  buildFilter(filters: Record<string, any>): Record<string, any> {
    const cleanFilters: Record<string, any> = {};
    for (const [key, val] of Object.entries(filters)) {
      if (val !== undefined && val !== null) {
        cleanFilters[key] = val;
      }
    }
    return cleanFilters;
  }
}

export const ragMetadata = new RAGMetadata();
