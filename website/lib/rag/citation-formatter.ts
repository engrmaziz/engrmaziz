export class CitationFormatter {
  static format(rawContent: string, retrievedCitations: any[]): string {
    if (!rawContent) return rawContent;

    const sourceMap = new Map<string, { num: number; title: string; url: string }>();
    let counter = 1;

    // Match exact URL brackets like [/pec-engineer]
    const formattedContent = rawContent.replace(/\[(\/[^\]]+|https?:\/\/[^\]]+)\]/g, (match, url) => {
      // Find matching citation metadata from retrieval
      let title = url;
      const foundCitation = retrievedCitations.find(c => c.url === url);
      if (foundCitation && foundCitation.title) {
        title = foundCitation.title;
      }

      if (sourceMap.has(url)) {
        return `[${sourceMap.get(url)!.num}]`;
      } else {
        sourceMap.set(url, { num: counter, title, url });
        const marker = `[${counter}]`;
        counter++;
        return marker;
      }
    });

    if (sourceMap.size === 0) {
      return formattedContent;
    }

    // Generate strict text-based Sources section as requested
    let sourcesBlock = '\n\nSources\n\n';
    const sortedSources = Array.from(sourceMap.values()).sort((a, b) => a.num - b.num);
    
    for (const source of sortedSources) {
      sourcesBlock += `[${source.num}] ${source.title}\n[${source.url}](${source.url})\n\n`;
    }

    return formattedContent + sourcesBlock.trimEnd();
  }
}
