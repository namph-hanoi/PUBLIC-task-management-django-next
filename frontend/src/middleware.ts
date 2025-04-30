import { NextResponse } from "next/server";

// const protectedRoutes = ["/dashboard", "/dashboard", "/logout"];
const protectedRoutes = ['/dashboard', '/task'];

const hasAuth = (cookies: string) => {
  return /(?<!ref-)auth/g.test(cookies);
};

export async function middleware(request: Request) {
  try {
    console.log(`Middleware accessed: ${request.url}`);
    const url = new URL(request.url);
    const isProtectedRoute = protectedRoutes.some(route => url.pathname.startsWith(route));
  
    const cookies = request.headers.get('cookie') || '';
  
    if (isProtectedRoute && !hasAuth(cookies)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  
    if (!isProtectedRoute && hasAuth(cookies)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next()
  } catch (error) {
    console.log(error)
  }
 
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}