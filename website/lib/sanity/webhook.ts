/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { ingestionPipeline } from '@/lib/rag/pipeline/IngestionPipeline';
import { db } from '@/lib/db/supabase';
import { logger } from '@/lib/utils/logger';

export class SanityWebhookHandler {
  async processPublish(payload: any) {
    const { _id, title, body, slug } = payload;
    
    logger.info(`Processing Sanity Publish Webhook for: ${slug.current}`);

    try {
      // 1. Process via unified pipeline
      const result = await ingestionPipeline.processDocument(title, body, {
        sourceType: 'sanity',
        sourceUrl: `/blog/${slug.current}`,
        metadata: { sanityId: _id }
      });

      // 2. Track synchronization locally in Supabase
      await db.insert('blog_sync', {
        document_id: result.documentId,
        slug: slug.current,
        published: true,
        embedding_status: 'completed',
        last_indexed: new Date().toISOString()
      });

      return { success: true, documentId: result.documentId };
    } catch (error) {
      logger.error(`Sanity sync failed for ${slug.current}`, { error });
      throw error;
    }
  }
}

export const sanityWebhook = new SanityWebhookHandler();
