import { NextRequest, NextResponse } from 'next/server';
import { generateSecurityHeaders } from '@/utils/securityConfig';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Apply security headers
  const isDevelopment = process.env.NODE_ENV === 'development';
  const securityHeaders = generateSecurityHeaders(isDevelopment);
  
  // Set all security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Add performance hints
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  
  // Enable compression hints
  response.headers.set('Vary', 'Accept-Encoding');
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
