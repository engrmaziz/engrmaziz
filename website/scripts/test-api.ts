class MockWebSocket {}
global.WebSocket = MockWebSocket as any;

import { NextRequest } from 'next/server';
import { POST } from '../app/api/chat/route';
import { env } from '../lib/config/env';

async function test() {
  const req = new NextRequest('http://localhost:3000/api/chat', {
    method: 'POST',
    body: JSON.stringify({
      conversationId: '123e4567-e89b-12d3-a456-426614174000',
      message: 'Hello, who is Musharraf?',
      visitorInfo: { name: 'Test', email: 'test@test.com' }
    })
  });
  
  const res = await POST(req);
  console.log('Status:', res.status);
  console.log('Body:', await res.text());
}

test().catch(console.error);
