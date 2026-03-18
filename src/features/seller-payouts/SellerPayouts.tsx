"use client";

import { IconArrowLeft, IconLoader2, IconCoins, IconClock } from "@tabler/icons-react";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { OrderService } from "@/services/order.service";
import { formatPrice } from "@/utils/format/price";

export default function SellerPayouts() {
  const router = useRouter();
  const { data: account, isLoading: userLoading } = useUser();
  const [wallet, setWallet] = useState<{
    balance: number;
    pendingBalance: number;
    totalEarned: number;
    totalWithdrawn: number;
  } | null>(null);
  const [payouts, setPayouts] = useState<{ data: unknown[]; total: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userLoading && !account) {
      router.push("/login");
      return;
    }
    if (!account) return;

    const load = async () => {
      try {
        const [w, p] = await Promise.all([
          OrderService.getSellerWallet().catch(() => null),
          OrderService.getSellerPayouts({ limit: 20 }).catch(() => ({ data: [], total: 0 })),
        ]);
        setWallet(w);
        setPayouts(p ?? { data: [], total: 0 });
      } catch {
        setWallet(null);
        setPayouts({ data: [], total: 0 });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [account, userLoading, router]);

  if (userLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <IconLoader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!account) return null;

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <Link href="/seller" className="inline-flex items-center gap-2 text-primary hover:underline font-medium text-sm mb-6">
        <IconArrowLeft className="h-4 w-4" />
        Quay lại
      </Link>

      <h1 className="text-2xl font-bold text-foreground mb-6">Ví & Thanh toán</h1>

      {loading ? (
        <div className="flex justify-center py-16">
          <IconLoader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
              <IconCoins className="w-5 h-5 text-green-600 mb-2" />
              <div className="font-bold text-foreground">{formatPrice(wallet?.balance ?? 0)}</div>
              <div className="text-xs text-muted-foreground">Số dư khả dụng</div>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
              <IconClock className="w-5 h-5 text-amber-600 mb-2" />
              <div className="font-bold text-foreground">{formatPrice(wallet?.pendingBalance ?? 0)}</div>
              <div className="text-xs text-muted-foreground">Chờ rút</div>
            </div>
            <div className="bg-primary/8 border border-primary/15 rounded-2xl p-4">
              <IconCoins className="w-5 h-5 text-primary mb-2" />
              <div className="font-bold text-foreground">{formatPrice(wallet?.totalEarned ?? 0)}</div>
              <div className="text-xs text-muted-foreground">Tổng đã thu</div>
            </div>
            <div className="bg-muted/50 border border-border rounded-2xl p-4">
              <div className="font-bold text-foreground">{formatPrice(wallet?.totalWithdrawn ?? 0)}</div>
              <div className="text-xs text-muted-foreground">Đã rút</div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <h2 className="font-semibold text-foreground mb-3">Lịch sử thanh toán</h2>
            {!payouts?.data?.length ? (
              <p className="text-sm text-muted-foreground">Chưa có giao dịch nào</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                {payouts.total} giao dịch (hiển thị 20 mới nhất)
              </p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
