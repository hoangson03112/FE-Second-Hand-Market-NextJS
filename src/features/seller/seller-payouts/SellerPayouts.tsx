"use client";

import {
  IconArrowLeft,
  IconLoader2,
  IconCoins,
  IconClock,
  IconWallet,
} from "@tabler/icons-react";
import Link from "next/link";
import { useSellerWallet } from "./hooks/useSellerWallet";
import { WalletStatCard } from "./components/WalletStatCard";
import { PayoutHistoryList } from "./components/PayoutHistoryList";

export default function SellerPayouts() {
  const {
    userLoading,
    account,
    wallet,
    walletError,
    payouts,
    payoutsError,
    isLoading,
  } = useSellerWallet();

  if (userLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <IconLoader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!account) return null;

  return (
    <main className="max-w-8xl mx-auto w-full px-4 py-8 sm:px-6 bg-cream-50 min-h-screen">
      <Link
        href="/seller"
        className="inline-flex items-center gap-2 text-primary hover:underline font-medium text-sm mb-6"
      >
        <IconArrowLeft className="h-4 w-4" />
        Quay lại
      </Link>

      <h1 className="text-xl font-bold text-taupe-900 mb-6">Ví & Thanh toán</h1>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <IconLoader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-6">
          {walletError && (
            <div className="rounded-xl bg-red-50 border-2 border-red-200 p-4 text-sm text-red-600">
              {walletError}
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <WalletStatCard
              icon={IconCoins}
              amount={wallet?.balance ?? 0}
              label="Số dư khả dụng"
              tone="success"
            />
            <WalletStatCard
              icon={IconClock}
              amount={wallet?.pendingBalance ?? 0}
              label="Chờ rút"
              tone="warning"
            />
            <WalletStatCard
              icon={IconCoins}
              amount={wallet?.totalEarned ?? 0}
              label="Tổng đã thu"
              tone="primary"
            />
            <WalletStatCard
              icon={IconWallet}
              amount={wallet?.totalWithdrawn ?? 0}
              label="Đã rút"
              tone="neutral"
            />
          </div>

          <div className="rounded-2xl border-2 border-border bg-gradient-to-br from-cream-50 to-white p-5 shadow-md">
            <h2 className="font-bold text-taupe-900 mb-3 uppercase tracking-wide text-sm">
              Lịch sử thanh toán
            </h2>
            <PayoutHistoryList
              payouts={payouts.data}
              total={payouts.total}
              error={payoutsError}
            />
          </div>
        </div>
      )}
    </main>
  );
}
