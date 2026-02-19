"use client";

import { Suspense } from "react";
import Verify from "@/components/feature/Verify";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    }>
      <Verify />
    </Suspense>
  );
}
