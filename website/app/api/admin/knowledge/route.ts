/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { adminKnowledgeService } from '../../../../lib/knowledge/admin-service';
import { CreateKnowledgeDocumentRequest } from '../../../../lib/knowledge/contracts';
import { authorizationService, PERMISSIONS } from '../../../../lib/security';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const user = authorizationService.authenticate(authHeader);
    authorizationService.authorize(user, [PERMISSIONS.KNOWLEDGE_WRITE]);

    const body = await request.json() as CreateKnowledgeDocumentRequest;

    if (!body || !body.id || !body.content) {
      return NextResponse.json({ error: 'Invalid request payload. id and content are required.' }, { status: 400 });
    }

    const response = await adminKnowledgeService.createDocument(body);

    return NextResponse.json(response, { status: 201 });
  } catch (err: any) {
    if (err.name === 'AuthenticationError') {
      return NextResponse.json({ error: err.message }, { status: 401 });
    }
    if (err.name === 'AuthorizationError' || err.name === 'ForbiddenError') {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    if (err.name === 'KnowledgeValidationError') {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    if (err.name === 'KnowledgeExecutionError') {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
