"use client";

import { Suspense } from "react";
import Verify from "@/features/auth/verify/Verify";

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60svh] items-center justify-center bg-luxury-ivory">
          <div className="h-10 w-10 animate-spin rounded-full border border-luxury-ink/15 border-t-luxury-ink" />
        </div>
      }
    >
      <Verify />
    </Suspense>
  );
}
