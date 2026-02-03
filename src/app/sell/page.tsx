"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useTokenStore } from "@/store/useTokenStore";
import SellForm from "@/components/feature/sell";

export default function SellPage() {
  const router = useRouter();
  const accessToken = useTokenStore((s) => s.accessToken);
  const { data: account, isLoading } = useUser();

  useEffect(() => {
    if (isLoading) return;
    if (!accessToken || !account) {
      router.replace("/login?redirect=/sell");
      return;
    }
  }, [accessToken, account, isLoading, router]);

  if (isLoading || !accessToken || !account) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return <SellForm />;
}
