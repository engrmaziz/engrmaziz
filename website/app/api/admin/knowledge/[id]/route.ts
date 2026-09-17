/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { adminKnowledgeService } from '../../../../../lib/knowledge/admin-service';
import { authorizationService, PERMISSIONS } from '../../../../../lib/security';
import { checkRateLimit, getClientIp } from '@/lib/security/rate-limit';
import { RateLimitError } from '@/lib/utils/errors';

function rateLimitResponse(err: unknown) {
  if (err instanceof RateLimitError || (err && typeof err === 'object' && 'name' in err && err.name === 'RateLimitError')) {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
  }
  return null;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await checkRateLimit(getClientIp(request), 'admin-knowledge', 30, 60000);
    const authHeader = request.headers.get('Authorization');
    const user = authorizationService.authenticate(authHeader);
    authorizationService.authorize(user, [PERMISSIONS.KNOWLEDGE_READ]);

    const documentId = params.id;
    if (!documentId) {
      return NextResponse.json({ error: 'Document ID is required.' }, { status: 400 });
    }

    const response = await adminKnowledgeService.getDocument(documentId);

    if (!response.document) {
      return NextResponse.json({ error: 'Document not found.' }, { status: 404 });
    }

    return NextResponse.json(response, { status: 200 });
  } catch (err: any) {
    if (err.name === 'AuthenticationError') {
      return NextResponse.json({ error: err.message }, { status: 401 });
    }
    if (err.name === 'AuthorizationError' || err.name === 'ForbiddenError') {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    if (err.name === 'StorageExecutionError') {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return rateLimitResponse(err) || NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await checkRateLimit(getClientIp(request), 'admin-knowledge', 30, 60000);
    const authHeader = request.headers.get('Authorization');
    const user = authorizationService.authenticate(authHeader);
    authorizationService.authorize(user, [PERMISSIONS.KNOWLEDGE_DELETE]);

    const documentId = params.id;
    if (!documentId) {
      return NextResponse.json({ error: 'Document ID is required.' }, { status: 400 });
    }

    const response = await adminKnowledgeService.deleteDocument({ documentId });

    return NextResponse.json(response, { status: 200 });
  } catch (err: any) {
    if (err.name === 'AuthenticationError') {
      return NextResponse.json({ error: err.message }, { status: 401 });
    }
    if (err.name === 'AuthorizationError' || err.name === 'ForbiddenError') {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    if (err.name === 'StorageExecutionError') {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return rateLimitResponse(err) || NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
