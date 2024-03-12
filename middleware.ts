import NextAuth from "next-auth";

import authConfig from "@/auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
  registerRoutes
} from "@/routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isRegisterRoute = registerRoutes.includes(nextUrl.pathname);
  const hasToken = nextUrl.searchParams.has("token");

  // if statements must be in this order,
  // because we didnt include isApiAuthRoutes in the publicRoutes array,
  // in the routes.ts file. So we have to check isAPiAuthRoute
  // first before we check the public routes manually. 
  // Otherwise you'll be left in an infinite redirect loop.
  
  // Bypass middleware for API routes, including your stripe webhook
  if (nextUrl.pathname.startsWith('/api/')) {
    return;
  }

  if (isApiAuthRoute) {
    return;
  }

  if (isRegisterRoute) {
    const token = nextUrl.searchParams.get("token");

    if (!token) {
      // Redirect to login or an error page
      return Response.redirect(new URL("/", nextUrl));
    }

    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    
    // Check if the route is /auth/register and if it does not have a valid token
    if (isRegisterRoute && !hasToken) {
      // If it's an attempt to access /auth/register without a token, 
      // set callbackUrl to a default page like / or /settings
      callbackUrl = DEFAULT_LOGIN_REDIRECT;
    } else if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(new URL(`/?callbackUrl=${encodedCallbackUrl}`, nextUrl));
  }

  // be default allow any other route
  return;
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}