// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const pathname = request.nextUrl.pathname;

  const isAuthPage = pathname.startsWith('/Auth/SignIn') || pathname.startsWith('/Auth/SignUp');
  const isRootPage = pathname === '/';

  // If no session and trying to access protected route (not SignIn or SignUp), redirect to SignIn
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/Auth/SignIn', request.url));
  }

  // If authenticated and trying to access SignIn or SignUp, redirect to homepage
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/'], 
};
