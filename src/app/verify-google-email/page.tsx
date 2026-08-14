"use client";

import { Suspense } from "react";
import VerifyGoogleEmail from "@/features/auth/verify-google-email/VerifyGoogleEmail";

export default function VerifyGoogleEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60svh] items-center justify-center bg-luxury-ivory">
          <div className="h-10 w-10 animate-spin rounded-full border border-luxury-ink/15 border-t-luxury-ink" />
        </div>
      }
    >
      <VerifyGoogleEmail />
    </Suspense>
  );
}
