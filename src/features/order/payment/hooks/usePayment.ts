"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { OrderService } from "@/services/order.service";
import type { SellerBankInfo } from "@/types/order";
import axiosClient from "@/lib/axios";
import { useToast } from "@/components/ui";
import {
  PAYMENT_WINDOW_MINUTES,
  formatCountdown,
  generateVietQRImageUrl,
} from "@/constants";

export type OrderLite = {
  _id: string;
  totalAmount: number;
  createdAt: string;
  paymentMethod?: string;
};

/** Client-side guard matching the copy shown on the upload dropzone. */
export const PROOF_MAX_BYTES = 10 * 1024 * 1024;

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
  const [loadError, setLoadError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreviewUrl, setProofPreviewUrl] = useState<string | null>(null);
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [bankInfo, setBankInfo] = useState<SellerBankInfo | null>(null);
  const [bankInfoLoading, setBankInfoLoading] = useState(true);
  const [bankInfoError, setBankInfoError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const toast = useToast();

  // `useToast()` builds a fresh object on every render, so referencing it
  // directly from the fetch effect's dependency array re-ran that effect after
  // every state update — an endless refetch loop. Read it through a ref.
  const toastRef = useRef(toast);
  toastRef.current = toast;

  useEffect(() => {
    if (!orderId) {
      router.push("/");
      return;
    }

    let cancelled = false;

    const fetchOrder = async () => {
      try {
        const response = await OrderService.getById(orderId);
        const normalized = toOrderLite(response.order);
        if (!normalized) {
          throw new Error("Dữ liệu đơn hàng không hợp lệ.");
        }
        if (cancelled) return;
        setOrder(normalized);
      } catch (error) {
        if (cancelled) return;
        const message = getErrorMessage(
          error,
          "Không thể tải thông tin đơn hàng",
        );
        setLoadError(message);
        toastRef.current.error(message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    const fetchBankInfo = async () => {
      setBankInfoLoading(true);
      setBankInfoError(null);
      try {
        const info = await OrderService.getSellerBankInfo(orderId);
        if (cancelled) return;
        setBankInfo(info);
      } catch (error) {
        if (cancelled) return;
        const msg = getErrorMessage(error, "Không thể tải thông tin ngân hàng");
        setBankInfoError(msg);
        toastRef.current.error(msg);
      } finally {
        if (!cancelled) setBankInfoLoading(false);
      }
    };

    fetchOrder();
    fetchBankInfo();

    return () => {
      cancelled = true;
    };
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
              "Đơn hàng bị hủy do hết thời gian thanh toán",
            );
            toastRef.current.error(
              "Đã hết thời gian thanh toán — đơn hàng đã được hủy.",
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

  /** Copies and reports which field was copied so the UI can confirm it. */
  const handleCopy = useCallback(async (text: string, field?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field ?? text);
      window.setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toastRef.current.error("Không thể sao chép. Vui lòng copy thủ công.");
    }
  }, []);

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
    // Previously this reported success even with nothing attached, so the buyer
    // was told the proof had been sent while no request was ever made.
    if (!proofFile) {
      setPaymentError(
        "Vui lòng tải lên ảnh chụp biên lai chuyển khoản trước khi xác nhận.",
      );
      return;
    }
    if (!bankInfo) {
      setPaymentError(
        "Chưa tải được thông tin ngân hàng của người bán. Vui lòng thử lại.",
      );
      return;
    }

    setIsConfirmingPayment(true);
    setPaymentError(null);
    setPaymentSuccess(null);
    try {
      const form = new FormData();
      form.append("orderId", orderId);
      form.append("bankName", bankInfo.bankName);
      form.append("accountNumber", bankInfo.accountNumber);
      form.append("accountHolder", bankInfo.accountHolder);
      form.append("proof", proofFile);
      await axiosClient.post("/bank-info/payment-proof", form);

      // Bank transfer confirmation is done by admin (POST /orders/:id/confirm-bank-transfer).
      // Buyer only needs to submit the proof; the admin will verify and confirm.
      setPaymentSuccess(
        "Đã gửi bằng chứng thanh toán thành công. Admin sẽ xác nhận trong vòng 24h.",
      );
      setProofFile(null);
      setTimeout(() => {
        router.push(`/orders/${orderId}`);
      }, 2500);
    } catch (error) {
      setPaymentError(
        getErrorMessage(
          error,
          "Không thể gửi bằng chứng thanh toán. Vui lòng thử lại.",
        ),
      );
    } finally {
      setIsConfirmingPayment(false);
    }
  };

  const setProofFileHandler = (file: File | null) => {
    setPaymentError(null);
    setPaymentSuccess(null);

    if (!file) {
      setProofFile(null);
      return;
    }
    // The dropzone advertises "PNG, JPG, WEBP (MAX. 10MB)" — enforce it here
    // rather than letting the upload fail server-side.
    if (!file.type.startsWith("image/")) {
      setProofFile(null);
      setPaymentError("Chỉ chấp nhận tệp ảnh (PNG, JPG, WEBP).");
      return;
    }
    if (file.size > PROOF_MAX_BYTES) {
      setProofFile(null);
      setPaymentError("Ảnh vượt quá 10MB. Vui lòng chọn ảnh nhỏ hơn.");
      return;
    }
    setProofFile(file);
  };

  return {
    orderId,
    order,
    isLoading,
    loadError,
    secondsLeft,
    formatCountdown,
    proofFile,
    proofPreviewUrl,
    isConfirmingPayment,
    paymentError,
    paymentSuccess,
    copiedField,
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
