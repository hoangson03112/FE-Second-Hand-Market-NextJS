"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { OrderService, type SellerBankInfo } from "@/services/order.service";
import axiosClient from "@/lib/axios";
import { useToast } from "@/components/ui";
import {
  PAYMENT_WINDOW_MINUTES,
  formatCountdown,
  generateVietQRImageUrl,
} from "../constants";

export type OrderLite = {
  _id: string;
  totalAmount: number;
  createdAt: string;
  paymentMethod?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (!isRecord(error)) return fallback;
  const response = error.response;
  if (isRecord(response)) {
    const data = response.data;
    if (isRecord(data) && typeof data.message === "string" && data.message) {
      return data.message;
    }
  }
  if (typeof error.message === "string" && error.message) return error.message;
  return fallback;
}

function toOrderLite(value: unknown): OrderLite | null {
  if (!isRecord(value)) return null;
  const _id = value._id;
  const totalAmount = value.totalAmount;
  const createdAt = value.createdAt;
  const paymentMethod = value.paymentMethod;
  if (typeof createdAt !== "string" || !createdAt) return null;
  return {
    _id: typeof _id === "string" ? _id : String(_id ?? ""),
    totalAmount:
      typeof totalAmount === "number" ? totalAmount : Number(totalAmount ?? 0),
    createdAt,
    paymentMethod: typeof paymentMethod === "string" ? paymentMethod : undefined,
  };
}

export function usePayment() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<OrderLite | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreviewUrl, setProofPreviewUrl] = useState<string | null>(null);
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);
  const [bankInfo, setBankInfo] = useState<SellerBankInfo | null>(null);
  const [bankInfoLoading, setBankInfoLoading] = useState(true);
  const [bankInfoError, setBankInfoError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (!orderId) {
      router.push("/");
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await OrderService.getById(orderId);
        const normalized = toOrderLite(response.order);
        if (!normalized) {
          throw new Error("Dữ liệu đơn hàng không hợp lệ.");
        }
        setOrder(normalized);
      } catch (error) {
        console.error("Error fetching order:", error);
        toast.error(getErrorMessage(error, "Không thể tải thông tin đơn hàng"));
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchBankInfo = async () => {
      if (!orderId) return;
      setBankInfoLoading(true);
      setBankInfoError(null);
      try {
        const info = await OrderService.getSellerBankInfo(orderId);
        setBankInfo(info);
      } catch (error) {
        console.error("Error fetching bank info:", error);
        const msg = getErrorMessage(
          error,
          "Không thể tải thông tin ngân hàng"
        );
        setBankInfoError(msg);
        toast.error(msg);
      } finally {
        setBankInfoLoading(false);
      }
    };

    fetchOrder();
    fetchBankInfo();
  }, [orderId, router]);

  const expiresAt = useMemo(() => {
    if (!order?.createdAt) return null;
    const createdAt = new Date(order.createdAt).getTime();
    return createdAt + PAYMENT_WINDOW_MINUTES * 60 * 1000;
  }, [order?.createdAt]);

  useEffect(() => {
    if (!expiresAt) return;
    const tick = () => {
      const diffMs = expiresAt - Date.now();
      const seconds = Math.max(0, Math.floor(diffMs / 1000));
      setSecondsLeft(seconds);
      if (seconds === 0 && orderId && order && !isCancelling) {
        setIsCancelling(true);
        const cancelOrder = async () => {
          try {
            await OrderService.updateStatus(
              orderId,
              "cancelled",
              "Đơn hàng bị hủy do hết thời gian thanh toán"
            );
          } catch (error) {
            console.error("Error cancelling expired order:", error);
          } finally {
            router.push("/");
          }
        };
        cancelOrder();
      }
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [expiresAt, orderId, order, router, isCancelling]);

  const displayBankInfo = bankInfo || {
    bankName: "Đang tải...",
    accountNumber: "...",
    accountHolder: "...",
    amount: order?.totalAmount || 0,
    content: orderId ? `THANH TOAN DON HANG ${orderId}` : "",
    orderId: orderId || "",
  };

  const qrCodeImageUrl = useMemo(() => {
    if (!bankInfo) return "";
    return generateVietQRImageUrl(bankInfo);
  }, [bankInfo]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore
    }
  };

  const isExpired = secondsLeft !== null && secondsLeft <= 0;

  useEffect(() => {
    if (!proofFile) {
      setProofPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(proofFile);
    setProofPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [proofFile]);

  const handleConfirmPayment = async () => {
    if (!orderId) return;
    if (isExpired) {
      setPaymentError("Đã hết thời gian thanh toán cho đơn này.");
      return;
    }
    setIsConfirmingPayment(true);
    setPaymentError(null);
    setPaymentSuccess(null);
    try {
      if (proofFile && bankInfo) {
        try {
          const form = new FormData();
          form.append("orderId", orderId);
          form.append("bankName", bankInfo.bankName);
          form.append("accountNumber", bankInfo.accountNumber);
          form.append("accountHolder", bankInfo.accountHolder);
          form.append("proof", proofFile);
          await axiosClient.post("/bank-info/payment-proof", form);
        } catch (error) {
          console.error("Error uploading proof:", error);
        }
      }
      await OrderService.confirmPayment(orderId);
      setPaymentSuccess(
        "Đã xác nhận thanh toán thành công. Đơn hàng của bạn đang được xử lý."
      );
      setProofFile(null);
      setTimeout(() => {
        router.push(`/orders/${orderId}`);
      }, 2000);
    } catch (error) {
      setPaymentError(
        getErrorMessage(error, "Không thể xác nhận thanh toán. Vui lòng thử lại.")
      );
    } finally {
      setIsConfirmingPayment(false);
    }
  };

  const setProofFileHandler = (file: File | null) => {
    setProofFile(file);
    setPaymentError(null);
    setPaymentSuccess(null);
  };

  return {
    orderId,
    order,
    isLoading,
    secondsLeft,
    formatCountdown,
    proofFile,
    proofPreviewUrl,
    isConfirmingPayment,
    paymentError,
    paymentSuccess,
    bankInfo,
    bankInfoLoading,
    bankInfoError,
    displayBankInfo,
    qrCodeImageUrl,
    isExpired,
    handleCopy,
    handleConfirmPayment,
    setProofFile: setProofFileHandler,
  };
}
