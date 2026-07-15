import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { POST } from '../app/api/admin/knowledge/route';
import { GET, DELETE } from '../app/api/admin/knowledge/[id]/route';
import { knowledgeService } from '../lib/knowledge/service';
import { systemConfig } from '../lib/system/config';
import { storagePipeline } from '../lib/storage/pipeline';
import { VectorRepository } from '../lib/storage/repository';
import { logger } from '../lib/utils/logger';
import { KnowledgeValidationError, KnowledgeExecutionError } from '../lib/knowledge/errors';
import { StorageExecutionError } from '../lib/storage/errors';

async function verifyKnowledgeAPI() {
  logger.info('Starting Knowledge API Verification...');

  // 1. Mock underlying services
  const originalIngest = knowledgeService.ingest;
  const originalDelete = storagePipeline.deleteDocument;
  const originalGetDoc = VectorRepository.prototype.getDocumentMetadata;

  knowledgeService.ingest = async (req) => {
    if (req.document.id === 'error-doc') {
      throw new KnowledgeExecutionError('Mock execution error');
    }
    if (req.document.id === 'invalid-doc') {
      throw new KnowledgeValidationError('Mock validation error');
    }
    return {
      documentId: req.document.id,
      success: true,
      statistics: { chunkCount: 10, storedRecordCount: 10, durationMs: 100 }
    };
  };

  storagePipeline.deleteDocument = async (req) => {
    if (req.documentId === 'error-doc') {
      throw new StorageExecutionError('Mock storage error');
    }
    return { documentId: req.documentId, success: true };
  };

  VectorRepository.prototype.getDocumentMetadata = async (id) => {
    if (id === 'error-doc') throw new StorageExecutionError('Mock DB Error');
    if (id === 'missing-doc') return null;
    return {
      id,
      document_type: 'markdown',
      title: 'Mock Doc',
      created_at: '2026-01-01T00:00:00Z',
      embedding_status: 'completed',
      metadata: { source: 'test' }
    };
  };

const authHeader = { 'Authorization': `Bearer ${systemConfig.ADMIN_API_TOKEN}` };

  // 2. Test POST
  const postReq = new Request('http://localhost/api/admin/knowledge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader },
    body: JSON.stringify({ id: 'valid-doc', type: 'markdown', content: 'test content' })
  });
  const postRes = await POST(postReq);
  if (postRes.status !== 201) throw new Error(`Expected 201, got ${postRes.status}`);
  const postBody = await postRes.json();
  if (postBody.documentId !== 'valid-doc' || postBody.chunkCount !== 10) throw new Error('POST body invalid');
  logger.info('[PASS] POST /api/admin/knowledge');

  // 3. Test POST Validation Error
  const postInvalidReq = new Request('http://localhost/api/admin/knowledge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader },
    body: JSON.stringify({ id: 'invalid-doc', type: 'markdown', content: 'test content' })
  });
  const postInvalidRes = await POST(postInvalidReq);
  if (postInvalidRes.status !== 400) throw new Error(`Expected 400, got ${postInvalidRes.status}`);
  logger.info('[PASS] POST validation error mapped to 400');

  // 4. Test POST Execution Error
  const postErrorReq = new Request('http://localhost/api/admin/knowledge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader },
    body: JSON.stringify({ id: 'error-doc', type: 'markdown', content: 'test content' })
  });
  const postErrorRes = await POST(postErrorReq);
  if (postErrorRes.status !== 500) throw new Error(`Expected 500, got ${postErrorRes.status}`);
  logger.info('[PASS] POST execution error mapped to 500');

  // 5. Test GET
  const getReq = new Request('http://localhost/api/admin/knowledge/valid-doc', {
    headers: authHeader
  });
  const getRes = await GET(getReq, { params: { id: 'valid-doc' } });
  if (getRes.status !== 200) throw new Error(`Expected 200, got ${getRes.status}`);
  const getBody = await getRes.json();
  if (getBody.document.title !== 'Mock Doc') throw new Error('GET body invalid');
  logger.info('[PASS] GET /api/admin/knowledge/[id]');

  // 6. Test GET Not Found
  const getMissingReq = new Request('http://localhost/api/admin/knowledge/missing-doc', {
    headers: authHeader
  });
  const getMissingRes = await GET(getMissingReq, { params: { id: 'missing-doc' } });
  if (getMissingRes.status !== 404) throw new Error(`Expected 404, got ${getMissingRes.status}`);
  logger.info('[PASS] GET missing document mapped to 404');

  // 7. Test DELETE
  const delReq = new Request('http://localhost/api/admin/knowledge/valid-doc', { 
    method: 'DELETE',
    headers: authHeader
  });
  const delRes = await DELETE(delReq, { params: { id: 'valid-doc' } });
  if (delRes.status !== 200) throw new Error(`Expected 200, got ${delRes.status}`);
  const delBody = await delRes.json();
  if (delBody.documentId !== 'valid-doc' || !delBody.success) throw new Error('DELETE body invalid');
  logger.info('[PASS] DELETE /api/admin/knowledge/[id]');

  // 8. Test DELETE Execution Error
  const delErrorReq = new Request('http://localhost/api/admin/knowledge/error-doc', { 
    method: 'DELETE',
    headers: authHeader
  });
  const delErrorRes = await DELETE(delErrorReq, { params: { id: 'error-doc' } });
  if (delErrorRes.status !== 500) throw new Error(`Expected 500, got ${delErrorRes.status}`);
  logger.info('[PASS] DELETE execution error mapped to 500');

  // Restore mocks
  knowledgeService.ingest = originalIngest;
  storagePipeline.deleteDocument = originalDelete;
  VectorRepository.prototype.getDocumentMetadata = originalGetDoc;

  logger.info('Knowledge API Verification Completed Successfully.');
}

verifyKnowledgeAPI().catch(err => {
  logger.error('Verification failed', err);
  process.exit(1);
});
