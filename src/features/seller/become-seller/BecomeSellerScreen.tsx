"use client";

import {
  IconArrowLeft,
  IconCircleCheck,
  IconBuildingStore,
} from "@tabler/icons-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/features/auth/hooks/useUser";
import BecomeSeller from "./BecomeSeller";
import Link from "next/link";

export default function BecomeSellerScreen() {
  const router = useRouter();
  const { data: account, isLoading } = useUser();

  useEffect(() => {
    if (isLoading) return;
    if (!account) {
      router.replace("/login?redirect=/become-seller");
    }
  }, [account, isLoading, router]);

  if (isLoading || !account) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-ivory">
        <div className="animate-spin rounded-[2px] h-10 w-10 border-2 border-luxury-ink border-t-transparent" />
      </div>
    );
  }

  if (account.role === "seller") {
    return (
      <div className="min-h-screen bg-luxury-ivory text-luxury-ink">
        <div className="sticky top-0 z-10 border-b border-luxury-ink/10 bg-white/95 backdrop-blur-xs">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 h-14 flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-2xs uppercase tracking-[0.15em] font-bold text-neutral-500 hover:text-luxury-ink transition-colors"
            >
              <IconArrowLeft className="w-4 h-4" />
              Quay lại
            </button>
            <span className="text-luxury-ink/20 select-none">/</span>
            <span className="text-2xs uppercase tracking-[0.15em] font-bold text-luxury-ink">
              Tài khoản Người bán
            </span>
          </div>
        </div>

        <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-12">
          <div className="rounded-[2px] border border-luxury-ink/10 bg-white p-8 shadow-xs">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-[2px] bg-cream-50 border border-luxury-ink/10 flex items-center justify-center shrink-0">
                <IconCircleCheck className="w-6 h-6 text-emerald-700" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="font-droid-serif text-2xl font-bold text-luxury-ink mb-2">
                  Bạn đã là Seller chính thức
                </h1>
                <p className="text-xs text-neutral-600 leading-relaxed mb-6">
                  Tài khoản của bạn đã được kích hoạt đầy đủ quyền Người bán. Bạn có thể đăng bán sản phẩm không giới hạn và nhận thanh toán đối soát trực tiếp từ Ban Quản Trị.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/sell"
                    className="inline-flex items-center gap-2 rounded-[2px] bg-luxury-ink px-6 py-2.5 text-2xs font-bold uppercase tracking-[0.15em] text-luxury-ivory hover:bg-charcoal-800 transition-colors"
                  >
                    <IconBuildingStore className="w-4 h-4" />
                    Đăng sản phẩm mới
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex items-center rounded-[2px] border border-luxury-ink/20 px-6 py-2.5 text-2xs font-bold uppercase tracking-[0.15em] text-luxury-ink hover:bg-taupe-50 transition-colors"
                  >
                    Về trang chủ
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <BecomeSeller />;
}
