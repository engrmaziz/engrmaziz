import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CANONICAL_HOST = "maziz.me";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host")?.split(":")[0] || "";
  const isPreview = host.endsWith(".vercel.app");
  if (
    process.env.NODE_ENV === "production" &&
    host &&
    host !== CANONICAL_HOST &&
    !isPreview
  ) {
    const url = req.nextUrl.clone();
    url.protocol = "https:";
    url.host = CANONICAL_HOST;
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  if (req.nextUrl.pathname.startsWith('/admin') && process.env.NODE_ENV === 'production') {
    return new NextResponse('Not Found', { status: 404 });
  }

  const res = NextResponse.next();
  const isDev = process.env.NODE_ENV !== 'production';

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ''} https://challenges.cloudflare.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://cdn.sanity.io https://*.supabase.co;
    media-src 'self' blob:;
    font-src 'self';
    connect-src 'self' blob: https://*.supabase.co;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `;

  res.headers.set('Content-Security-Policy', cspHeader.replace(/\s{2,}/g, ' ').trim());
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(self), geolocation=()');
  if (!isDev) {
    res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  res.headers.append(
    'Link',
    `<${req.nextUrl.origin}/llms.txt>; rel="describedby"; type="text/plain"`
  );

  return res;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icon.png|icon-dark.png|icon-light.png|icon-192.png|icon-512.png|apple-touch-icon.png|apple-icon.png).*)',
  ],
};
