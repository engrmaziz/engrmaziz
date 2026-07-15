import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { POST } from '../app/api/admin/knowledge/route';
import { GET, DELETE } from '../app/api/admin/knowledge/[id]/route';
import { adminKnowledgeService } from '../lib/knowledge/admin-service';
import { logger } from '../lib/utils/logger';
import { systemConfig } from '../lib/system';

async function verifySecurityLayer() {
  logger.info('Starting Security & Authorization Verification...');

  // 1. Mock the downstream service so we don't hit the DB if auth passes
  const originalCreate = adminKnowledgeService.createDocument;
  const originalGet = adminKnowledgeService.getDocument;
  const originalDelete = adminKnowledgeService.deleteDocument;

  let serviceInvoked = false;

  adminKnowledgeService.createDocument = async (req) => {
    serviceInvoked = true;
    return { documentId: req.id, success: true, chunkCount: 1, storedRecordCount: 1, durationMs: 10 };
  };
  adminKnowledgeService.getDocument = async (id) => {
    serviceInvoked = true;
    return { document: { documentId: id, type: 'markdown', title: 'Test', uploadedAt: '', status: 'completed' } };
  };
  adminKnowledgeService.deleteDocument = async (req) => {
    serviceInvoked = true;
    return { documentId: req.documentId, success: true };
  };

  const VALID_TOKEN = systemConfig.ADMIN_API_TOKEN;
  if (!VALID_TOKEN) {
    throw new Error('ADMIN_API_TOKEN is missing from systemConfig. Cannot verify.');
  }

  const INVALID_TOKEN = 'invalid_dummy_token';

  // HELPER: Reset spy
  const resetSpy = () => { serviceInvoked = false; };

  // --- POST Tests ---
  
  // Test: Missing Authorization
  resetSpy();
  let req = new Request('http://localhost/api/admin/knowledge', {
    method: 'POST', body: JSON.stringify({ id: '1', type: 'markdown', content: 'test' })
  });
  let res = await POST(req);
  if (res.status !== 401) throw new Error(`Missing auth should be 401, got ${res.status}`);
  if (serviceInvoked) throw new Error('Service invoked on missing auth');
  logger.info('[PASS] POST missing Authorization -> 401');

  // Test: Invalid Token
  resetSpy();
  req = new Request('http://localhost/api/admin/knowledge', {
    method: 'POST', 
    headers: { 'Authorization': `Bearer ${INVALID_TOKEN}` },
    body: JSON.stringify({ id: '1', type: 'markdown', content: 'test' })
  });
  res = await POST(req);
  if (res.status !== 401) throw new Error(`Invalid auth should be 401, got ${res.status}`);
  if (serviceInvoked) throw new Error('Service invoked on invalid auth');
  logger.info('[PASS] POST invalid Authorization -> 401');

  // Test: Valid Token
  resetSpy();
  req = new Request('http://localhost/api/admin/knowledge', {
    method: 'POST', 
    headers: { 'Authorization': `Bearer ${VALID_TOKEN}` },
    body: JSON.stringify({ id: '1', type: 'markdown', content: 'test' })
  });
  res = await POST(req);
  if (res.status !== 201) throw new Error(`Valid auth should be 201, got ${res.status}`);
  if (!serviceInvoked) throw new Error('Service NOT invoked on valid auth');
  logger.info('[PASS] POST valid Authorization -> 201');

  // --- GET Tests ---

  // Test: Missing Authorization
  resetSpy();
  req = new Request('http://localhost/api/admin/knowledge/1');
  res = await GET(req, { params: { id: '1' } });
  if (res.status !== 401) throw new Error(`Missing auth should be 401, got ${res.status}`);
  if (serviceInvoked) throw new Error('Service invoked on missing auth');
  logger.info('[PASS] GET missing Authorization -> 401');

  // Test: Valid Token
  resetSpy();
  req = new Request('http://localhost/api/admin/knowledge/1', {
    headers: { 'Authorization': `Bearer ${VALID_TOKEN}` }
  });
  res = await GET(req, { params: { id: '1' } });
  if (res.status !== 200) throw new Error(`Valid auth should be 200, got ${res.status}`);
  if (!serviceInvoked) throw new Error('Service NOT invoked on valid auth');
  logger.info('[PASS] GET valid Authorization -> 200');

  // --- DELETE Tests ---

  // Test: Invalid Token
  resetSpy();
  req = new Request('http://localhost/api/admin/knowledge/1', {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${INVALID_TOKEN}` }
  });
  res = await DELETE(req, { params: { id: '1' } });
  if (res.status !== 401) throw new Error(`Invalid auth should be 401, got ${res.status}`);
  if (serviceInvoked) throw new Error('Service invoked on invalid auth');
  logger.info('[PASS] DELETE invalid Authorization -> 401');

  // Test: Valid Token
  resetSpy();
  req = new Request('http://localhost/api/admin/knowledge/1', {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${VALID_TOKEN}` }
  });
  res = await DELETE(req, { params: { id: '1' } });
  if (res.status !== 200) throw new Error(`Valid auth should be 200, got ${res.status}`);
  if (!serviceInvoked) throw new Error('Service NOT invoked on valid auth');
  logger.info('[PASS] DELETE valid Authorization -> 200');

  // Restore mocks
  adminKnowledgeService.createDocument = originalCreate;
  adminKnowledgeService.getDocument = originalGet;
  adminKnowledgeService.deleteDocument = originalDelete;

  logger.info('Security Verification Completed Successfully.');
}

verifySecurityLayer().catch(err => {
  logger.error('Verification failed', err);
  process.exit(1);
});
