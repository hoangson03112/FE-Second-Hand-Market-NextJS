"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/features/auth/hooks/useUser";
import SellForm from "@/features/seller/sell/SellForm";

function SellPageContent() {
  const router = useRouter();
  const { data: account, isLoading } = useUser();

  useEffect(() => {
    if (isLoading) return;
    if (!account) {
      router.replace("/login?redirect=/sell");
    }
  }, [account, isLoading, router]);

  if (isLoading || !account) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return <SellForm />;
}

export default function SellPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    }>
      <SellPageContent />
    </Suspense>
  );
}
