// @ts-nocheck
import { ingestionPipeline } from '../lib/ingestion/pipeline';
import { DocumentSource } from '../lib/ingestion/types';
import { UnsupportedDocumentTypeError, InvalidDocumentError } from '../lib/ingestion/errors';
import { INGESTION_CONSTANTS } from '../lib/ingestion/constants';
import { logger } from '../lib/utils/logger';

async function verifyIngestion() {
  logger.info('Starting Knowledge Ingestion Verification...');

  // 1. Text parsing & deterministic chunking
  const longText = 'A'.repeat(2500); // Should yield 3 chunks: [0-1000], [800-1800], [1600-2500] (lengths: 1000, 1000, 900)
  const source1: DocumentSource = {
    id: 'doc-1',
    filename: 'test.txt',
    rawContent: longText
  };

  const result1 = ingestionPipeline.process(source1);
  const result2 = ingestionPipeline.process(source1); // Repeated execution

  // Identical input -> Identical output
  if (JSON.stringify(result1) !== JSON.stringify(result2)) {
    throw new Error('Ingestion pipeline is not deterministic.');
  }
  logger.info('[PASS] Identical input yields identical output.');

  // Stable ordering & correct chunk sizes
  if (result1.chunks.length !== 3) {
    throw new Error(`Expected 3 chunks, got ${result1.chunks.length}`);
  }
  if (result1.chunks[0].content.length !== 1000 || result1.chunks[1].content.length !== 1000 || result1.chunks[2].content.length !== 900) {
    throw new Error('Chunk overlap calculation failed.');
  }
  logger.info('[PASS] Deterministic chunk ordering and overlap logic verified.');

  // Deterministic chunk IDs
  if (result1.chunks[0].id !== result2.chunks[0].id) {
    throw new Error('Chunk IDs are not stable across executions.');
  }
  logger.info('[PASS] Deterministic Chunk IDs (SHA-256) verified.');

  // 2. Markdown parsing
  const mdText = '# Header\n**Bold Text**\n_Italic Text_';
  const mdSource: DocumentSource = {
    id: 'doc-md',
    filename: 'test.md',
    rawContent: mdText
  };
  const mdResult = ingestionPipeline.process(mdSource);
  if (mdResult.chunks[0].content !== 'Header\nBold Text\nItalic Text') {
    throw new Error(`Markdown parsing failed. Got: ${mdResult.chunks[0].content}`);
  }
  logger.info('[PASS] Markdown parsing removes syntax correctly.');

  // 3. Unsupported Type Rejection
  const pdfSource: DocumentSource = {
    id: 'doc-pdf',
    filename: 'test.pdf',
    rawContent: 'PDF CONTENT'
  };
  let rejectedPdf = false;
  try {
    ingestionPipeline.process(pdfSource);
  } catch (err: any) {
    if (err instanceof UnsupportedDocumentTypeError) rejectedPdf = true;
  }
  if (!rejectedPdf) throw new Error('Failed to reject unsupported document type.');
  logger.info('[PASS] Unsupported document types deterministically rejected.');

  // 4. Empty Document Rejection
  const emptySource: DocumentSource = {
    id: 'doc-empty',
    filename: 'empty.txt',
    rawContent: '   \n  '
  };
  let rejectedEmpty = false;
  try {
    ingestionPipeline.process(emptySource);
  } catch (err: any) {
    if (err instanceof InvalidDocumentError) rejectedEmpty = true;
  }
  if (!rejectedEmpty) throw new Error('Failed to reject empty document.');
  logger.info('[PASS] Empty documents deterministically rejected.');

  logger.info('Knowledge Ingestion Verification Completed Successfully.');
}

verifyIngestion().catch(err => {
  logger.error('Verification failed', err);
  process.exit(1);
});
