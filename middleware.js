import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

// Routes that require authentication
const isProtectedRoute = createRouteMatcher([
    "/dashboard(.*)",
    "/resume(.*)",
    "/ai-cover-letter(.*)",
    "/interview(.*)",
    "/onboarding(.*)"
]);

// Routes that require onboarding to be completed
const requiresOnboarding = createRouteMatcher([
    "/dashboard(.*)",
    "/resume(.*)",
    "/ai-cover-letter(.*)",
    "/interview(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
    const { userId } = await auth();
    const url = new URL(req.url);

    // If not signed in and trying to access protected route, redirect to sign in
    if (!userId && isProtectedRoute(req)) {
        const { redirectToSignIn } = await auth();
        return redirectToSignIn();
    }

    // If signed in and trying to access a route that requires onboarding
    if (userId && requiresOnboarding(req)) {
        try {
            // Check if user has completed onboarding
            const user = await db.user.findUnique({
                where: { clerkUserId: userId },
                select: { industry: true }
            });

            // If user hasn't set an industry (not onboarded), redirect to onboarding
            if (!user?.industry) {
                return NextResponse.redirect(new URL('/onboarding', req.url));
            }
        } catch (error) {
            console.error("Error checking onboarding status in middleware:", error);
            // Continue to the requested page if there's an error checking status
        }
    }

    return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};