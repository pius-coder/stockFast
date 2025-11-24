/**
 * Middleware de Protection des Routes - stockFast
 * Protège les routes authentifiées et gère les redirections
 */

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Routes publiques (accessibles sans authentification)
const publicRoutes = ["/sign-in", "/sign-up", "/api/auth"]

// Routes protégées (nécessitent une authentification)
const protectedRoutes = ["/dashboard", "/products", "/sales", "/stock", "/settings"]

export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Vérifier si la route est publique
    const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

    // Vérifier si la route est protégée
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

    // Récupérer le token de session depuis les cookies
    const sessionToken = request.cookies.get("better-auth.session_token")?.value

    // Si route protégée et pas de session, rediriger vers sign-in
    if (isProtectedRoute && !sessionToken) {
        const signInUrl = new URL("/sign-in", request.url)
        signInUrl.searchParams.set("callbackUrl", pathname)
        return NextResponse.redirect(signInUrl)
    }

    // Si route publique (sign-in/sign-up) et session existe, rediriger vers dashboard
    if ((pathname === "/sign-in" || pathname === "/sign-up") && sessionToken) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // Si page d'accueil et session existe, rediriger vers dashboard
    if (pathname === "/" && sessionToken) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
}
