"use client";

import { Suspense } from "react";
import VerifyGoogleEmail from "@/features/verify-google-email/VerifyGoogleEmail";

export default function VerifyGoogleEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <VerifyGoogleEmail />
    </Suspense>
  );
}
