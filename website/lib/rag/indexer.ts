/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from 'fs';
import * as path from 'path';
import { ragPipeline } from './pipeline';

export class RAGIndexer {
  private baseDir = path.resolve(process.cwd(), '../workspace/knowledge-base/markdown');

  /**
   * Scans and indexes the entire knowledge base directory recursively.
   */
  async indexAll(): Promise<{
    total: number;
    indexed: number;
    skipped: number;
    failed: number;
    errors: Array<{ file: string; error: string }>;
  }> {
    console.log(`[RAGIndexer] Initializing crawler base: ${this.baseDir}`);
    
    if (!fs.existsSync(this.baseDir)) {
      throw new Error(`Knowledge base path does not exist: ${this.baseDir}`);
    }

    const files = this.crawlDirectory(this.baseDir);
    console.log(`[RAGIndexer] Found ${files.length} knowledge source files. starting indexing pipeline.`);

    let indexedCount = 0;
    let skippedCount = 0;
    let failedCount = 0;
    const errors: Array<{ file: string; error: string }> = [];

    for (const filePath of files) {
      try {
        const rawContent = fs.readFileSync(filePath, 'utf8');
        const relativePath = path.relative(this.baseDir, filePath);
        
        const result = await ragPipeline.ingestDocument(rawContent, {
          filename: relativePath,
          source: relativePath.replace(/\\/g, '/'),
          project: 'Website Knowledge Base'
        });

        if (result.skipped) {
          skippedCount++;
        } else {
          indexedCount++;
        }
      } catch (err: any) {
        failedCount++;
        console.error(`[RAGIndexer] Failed to index: ${filePath}. Error:`, err);
        errors.push({
          file: path.basename(filePath),
          error: err.message || String(err)
        });
      }
    }

    return {
      total: files.length,
      indexed: indexedCount,
      skipped: skippedCount,
      failed: failedCount,
      errors
    };
  }

  /**
   * Helper to recursively scan a directory for Markdown/text documents.
   */
  private crawlDirectory(dir: string, fileList: string[] = []): string[] {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        this.crawlDirectory(filePath, fileList);
      } else {
        const ext = path.extname(file).toLowerCase();
        if (ext === '.md' || ext === '.txt') {
          fileList.push(filePath);
        }
      }
    }
    
    return fileList;
  }
}

export const ragIndexer = new RAGIndexer();
