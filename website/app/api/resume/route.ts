import { NextResponse } from 'next/server';
import { envServer } from '@/lib/config/env.server';
import { env } from '@/lib/config/env';

export async function GET() {
  try {
    const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || '';
    const serviceRoleKey = envServer.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: 'Storage configured incorrectly.' }, { status: 500 });
    }

    const signRes = await fetch(`${supabaseUrl}/storage/v1/object/sign/resume/latest.pdf`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ expiresIn: 3600 })
    });

    if (!signRes.ok) {
      console.error('[Resume API] Failed to sign URL:', await signRes.text());
      throw new Error('Failed to generate signed URL');
    }

    const { signedURL } = await signRes.json();

    return NextResponse.json({ 
      url: `${supabaseUrl}/storage/v1${signedURL}`,
      size: "2.4 MB",
      updatedAt: new Date().toISOString().split('T')[0]
    });
  } catch (error) {
    console.error('[Resume API]', error);
    return NextResponse.json({ error: 'Failed to fetch resume' }, { status: 500 });
  }
}
