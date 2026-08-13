"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/features/auth/hooks/useUser";
import { OrderService } from "@/services/order.service";

export interface SellerWallet {
  balance: number;
  pendingBalance: number;
  totalEarned: number;
  totalWithdrawn: number;
}

export type PayoutStatus = "pending" | "processing" | "completed" | "failed";

/**
 * Shape assumed from OrderService.getSellerPayouts(). Adjust the fields to
 * match the real API response — the previous version typed this as
 * `unknown[]` and never rendered it, so there was nothing to infer from.
 */
export interface SellerPayout {
  _id: string;
  amount: number;
  status: PayoutStatus;
  createdAt: string;
  orderIds?: string[];
  bankName?: string;
  accountNumber?: string;
  note?: string;
}

interface PayoutsPage {
  data: SellerPayout[];
  total: number;
}

export function useSellerWallet() {
  const router = useRouter();
  const { data: account, isLoading: userLoading } = useUser();

  const [wallet, setWallet] = useState<SellerWallet | null>(null);
  const [payouts, setPayouts] = useState<PayoutsPage>({ data: [], total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [payoutsError, setPayoutsError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setWalletError(null);
    setPayoutsError(null);

    const [walletResult, payoutsResult] = await Promise.allSettled([
      OrderService.getSellerWallet(),
      OrderService.getSellerPayouts({ limit: 20 }),
    ]);

    if (walletResult.status === "fulfilled") {
      setWallet(walletResult.value);
    } else {
      setWallet(null);
      setWalletError("Không thể tải số dư ví. Vui lòng thử lại.");
    }

    if (payoutsResult.status === "fulfilled") {
      //   setPayouts(payoutsResult.value as PayoutsPage);
    } else {
      setPayouts({ data: [], total: 0 });
      setPayoutsError("Không thể tải lịch sử thanh toán. Vui lòng thử lại.");
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!userLoading && !account) {
      router.push("/login");
      return;
    }
    if (!account) return;
    load();
  }, [account, userLoading, router, load]);

  return {
    account,
    userLoading,
    wallet,
    walletError,
    payouts,
    payoutsError,
    isLoading,
    refetch: load,
  };
}
