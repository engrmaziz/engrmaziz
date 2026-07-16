/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
export class CitationFormatter {
  static format(rawContent: string, retrievedCitations: any[]): string {
    if (!rawContent) return rawContent;

    const sourceMap = new Map<number, { num: number; title: string; url: string }>();

    // The LLM now naturally emits numeric IDs like [1], [2] corresponding to the SOURCE IDs.
    // We match `[1]`, extract the number, ensure it exists in citations, and build the Sources block.
    // Wait, the regex `\[(\d+)\]` can match normal text if the LLM talks about arrays.
    // However, since we strictly instructed the LLM to use [1] for citations, it is safe.
    
    // First, map retrieved citations by their ID
    const citationById = new Map<number, any>();
    for (const c of retrievedCitations) {
      if (c.id) {
        citationById.set(c.id, c);
      }
    }

    let nextValidNum = 1;

    const formattedContent = rawContent.replace(/\[(\d+)\]/g, (match, idStr) => {
      const sourceId = parseInt(idStr, 10);
      const foundCitation = citationById.get(sourceId);
      
      if (!foundCitation) {
        // If the LLM hallucinated an ID or it's not a citation, leave it alone
        return match;
      }

      if (sourceMap.has(sourceId)) {
        return `[${sourceMap.get(sourceId)!.num}]`;
      } else {
        const assignedNum = nextValidNum++;
        sourceMap.set(sourceId, { 
          num: assignedNum, 
          title: foundCitation.title || foundCitation.url, 
          url: foundCitation.url || '#' 
        });
        return `[${assignedNum}]`;
      }
    });

    if (sourceMap.size === 0) {
      return formattedContent;
    }

    let sourcesBlock = '\n\nSources\n\n';
    const sortedSources = Array.from(sourceMap.values()).sort((a, b) => a.num - b.num);
    
    for (const source of sortedSources) {
      sourcesBlock += `[${source.num}] ${source.title}\n[${source.url}](${source.url})\n\n`;
    }

    return formattedContent + sourcesBlock.trimEnd();
  }
}
