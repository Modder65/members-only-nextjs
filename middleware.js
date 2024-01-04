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
  // in the routes.js file. So we have to check isAPiAuthRoute
  // first before we check the public routes manually. 
  // Otherwise you'll be left in an infinite redirect loop.
  if (isApiAuthRoute) {
    return null;
  }

  // Handle register route with token
  if (isRegisterRoute && hasToken) {
    // Allow access to the register page
    return null;
  } 

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  // Redirects user back to the page they were rpeviously at the next time
  // they log in. (This is used in login-form, login server action, and social.jsx for OAuth Logins)
  // ISSUE: Non-admins can use this to access admin pages if they manually
  // edit the url to go to an admin url, then log in as a user. It will
  // still redirect them to protected admin pages. 
  // RESOLVED: Used Admin role-gate to block content for non-admin users,
  // even if theyve used the trick above to access an admin only route.
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

    return Response.redirect(new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl));
  }

  // be default allow any other route
  return null;
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}