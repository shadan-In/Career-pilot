"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { BarLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function GetStartedPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      // If signed in, redirect to dashboard
      // The middleware will handle redirecting to onboarding if needed
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  // If not signed in, show sign-in options
  if (isLoaded && !isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Sign in to continue</h1>
        <p className="text-muted-foreground mb-8">
          Please sign in or create an account to access Career Pilot's features and start your journey.
        </p>
        <div className="flex gap-4">
          <Link href="/sign-in">
            <Button size="lg">Sign In</Button>
          </Link>
          <Link href="/sign-up">
            <Button size="lg" variant="outline">Create Account</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Loading state
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-2xl font-bold mb-6">Preparing your experience...</h1>
      <BarLoader color="#6366f1" width={200} />
    </div>
  );
}
