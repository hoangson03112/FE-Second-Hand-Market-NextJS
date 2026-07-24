"use client";

import { IconArrowLeft, IconCircleCheck, IconBuildingStore } from "@tabler/icons-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useTokenStore } from "@/store/useTokenStore";
import BecomeSeller from "@/features/become-seller/BecomeSeller";
import Link from "next/link";

export default function BecomeSellerPage() {
  const router = useRouter();
  const accessToken = useTokenStore((s) => s.accessToken);
  const { data: account, isLoading } = useUser();

  useEffect(() => {
    if (isLoading) return;
    if (!accessToken || !account) {
      router.replace("/login?redirect=/become-seller");
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

  if (account.role === "seller") {
    return (
      <div className="min-h-screen bg-background">
        {/* Top bar */}
        <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="max-w-8xl mx-auto w-full px-4 sm:px-6 h-14 flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <IconArrowLeft className="w-4 h-4" />
              Quay láº¡i
            </button>
            <span className="text-muted-foreground/40 select-none">|</span>
            <span className="text-sm font-medium text-foreground">TÃ i khoáº£n Seller</span>
          </div>
        </div>

        <div className="max-w-8xl mx-auto w-full px-4 sm:px-6 py-8">
          <div className="rounded-2xl border border-border bg-secondary/60 p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <IconCircleCheck className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-base font-bold text-foreground mb-1">
                Báº¡n Ä‘Ã£ lÃ  Seller
              </h1>
              <p className="text-sm text-muted-foreground mb-4">
                TÃ i khoáº£n cá»§a báº¡n Ä‘Ã£ Ä‘Æ°á»£c xÃ¡c minh. Báº¡n cÃ³ thá»ƒ Ä‘Äƒng sáº£n pháº©m vÃ  quáº£n lÃ½ Ä‘Æ¡n hÃ ng.
                Äá»ƒ cáº­p nháº­t thÃ´ng tin ngÃ¢n hÃ ng hoáº·c Ä‘á»‹a chá»‰, vui lÃ²ng liÃªn há»‡ há»— trá»£.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/sell"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <IconBuildingStore className="w-3.5 h-3.5" />
                  ÄÄƒng sáº£n pháº©m
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  Vá» trang chá»§
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <BecomeSeller />;
}
