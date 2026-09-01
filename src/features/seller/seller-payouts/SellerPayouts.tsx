"use client";

import {
  IconLoader2,
  IconCoins,
  IconClock,
  IconWallet,
  IconCash,
} from "@tabler/icons-react";
import { useSellerWallet } from "./hooks/useSellerWallet";
import { WalletStatCard } from "./components/WalletStatCard";
import { PayoutHistoryList } from "./components/PayoutHistoryList";
import AllProductsHeader from "@/features/product-list/components/AllProductsHeader";

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
      <div className="min-h-[50vh] flex items-center justify-center bg-luxury-ivory">
        <IconLoader2 className="h-10 w-10 animate-spin text-luxury-ink" />
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-luxury-ivory">
        <div className="flex items-center gap-3 text-sm font-medium text-luxury-ink">
          <IconLoader2 className="h-5 w-5 animate-spin" />
          <span>Đang chuyển hướng đăng nhập...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-9xl  min-h-screen bg-luxury-ivory text-luxury-ink">
      <AllProductsHeader
        total={payouts.total}
        title="Ví & Thanh toán"
        breadcrumbLabel="Seller"
        totalLabel="giao dịch"
      />

      <div className="px-4 pb-12 sm:px-8 lg:px-12">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <IconLoader2 className="h-10 w-10 animate-spin text-luxury-ink" />
          </div>
        ) : (
          <div className="space-y-6">
            {walletError && (
              <div className="rounded-[22px] border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                {walletError}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
                icon={IconCash}
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

            <div className="rounded-[30px] border border-taupe-200/80 bg-white/80 p-6 shadow-[0_18px_45px_rgba(28,27,24,0.04)] backdrop-blur-sm">
              <div className="mb-5 flex items-center justify-between gap-3 border-b border-taupe-200/70 pb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-charcoal-400">
                    Giao dịch
                  </p>
                  <h2 className="mt-2 text-xl font-medium text-luxury-ink">
                    Lịch sử thanh toán
                  </h2>
                </div>
                <span className="rounded-full border border-taupe-200 bg-luxury-ivory px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-charcoal-500">
                  {payouts.total} giao dịch
                </span>
              </div>

              <PayoutHistoryList
                payouts={payouts.data}
                total={payouts.total}
                error={payoutsError}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
