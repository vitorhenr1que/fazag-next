import { NextRequest, NextResponse } from 'next/server';

const allowedOrigins = new Set([
  'https://fazag.edu.br',
  'https://matriculas.fazag.edu.br',
  'https://fazag-next.vercel.app',
  'https://motivabolsas.com.br',
]);

const allowedMethods = 'GET, DELETE, PATCH, POST, PUT, OPTIONS';
const defaultAllowedHeaders =
  'Origin, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization';

function setCorsHeaders(request: NextRequest, response: NextResponse) {
  const origin = request.headers.get('origin');

  if (!origin || !allowedOrigins.has(origin)) {
    return;
  }

  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Methods', allowedMethods);
  response.headers.set(
    'Access-Control-Allow-Headers',
    request.headers.get('access-control-request-headers') ?? defaultAllowedHeaders
  );
  response.headers.set('Access-Control-Max-Age', '86400');
  response.headers.append('Vary', 'Origin');
}

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin');

  if (request.method === 'OPTIONS') {
    if (!origin || !allowedOrigins.has(origin)) {
      return new NextResponse(null, { status: 403 });
    }

    // Next.js 13.4 can incorrectly continue routing an empty 204 response and
    // turn it into a 404. A 200 response is equally valid for CORS preflights.
    const response = new NextResponse(null, { status: 200 });
    setCorsHeaders(request, response);
    return response;
  }

  const response = NextResponse.next();
  setCorsHeaders(request, response);
  return response;
}

export const config = {
  matcher: '/api/:path*',
};
