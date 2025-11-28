import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from 'better-auth/cookies'

const protectedRoutes = ['/profile', '/post/edit', '/post/create']

export async function proxy(request: NextRequest) {
    const pathName = request.nextUrl.pathname  // get the current pathname

    const sessionCookie = getSessionCookie(request)

    const isProtectedRoute = protectedRoutes.some(route => pathName.startsWith(route)) // .some returns true if current route exists in protectedRoutes array 

    // if user is on a protected route then redirect it to the auth page
    if (isProtectedRoute && !sessionCookie) return NextResponse.redirect(new URL("/auth", request.url))

    // if user is already logged in then a session cookie is present, then redirect user to the home page
    if (pathName === "/auth" && sessionCookie) return NextResponse.redirect(new URL("/", request.url))

    // execute the next thing that is written after the proxy aka middeware
    return NextResponse.next()
}

export const config = {
    matcher: ['/profile/:path*', '/post/create', '/post/edit/:path*', '/auth']  // specify the routes the proxy applies to
}