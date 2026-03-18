import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/hooks/useUser";
import { SellerService } from "@/services/seller.service";
import { useToast } from "@/components/ui/Toast";
import { PROFILE_MESSAGES } from "@/constants";
import type { BankFormData } from "../types";

const SELLER_INFO_KEY = ["seller", "profile"] as const;

export function useSellerBank() {
  const { data: account } = useUser();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<BankFormData>({
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    bankBin: "",
  });

  const accountId = account?.accountID;
  const isSeller = account?.role === "seller";

  const { data: sellerResponse, isLoading: isLoadingSeller } = useQuery({
    queryKey: [...SELLER_INFO_KEY, accountId],
    queryFn: () => SellerService.getSellerInfo(accountId!),
    enabled: !!accountId && isSeller,
  });

  const seller = sellerResponse?.success ? sellerResponse.data : null;

  useEffect(() => {
    if (seller?.bankInfo) {
      setFormData({
        bankName: seller.bankInfo.bankName || "",
        accountNumber: seller.bankInfo.accountNumber || "",
        accountHolder: seller.bankInfo.accountHolder || "",
        bankBin: seller.bankInfo.bankBin ?? "",
      });
    }
  }, [seller]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.bankName.trim() || !formData.accountNumber.trim() || !formData.accountHolder.trim()) {
      toast.error("Vui lòng nhập đầy đủ tên ngân hàng, số tài khoản và chủ tài khoản.");
      return;
    }
    setIsSubmitting(true);
    try {
      await SellerService.updateBankInfo({
        bankName: formData.bankName.trim(),
        accountNumber: formData.accountNumber.trim(),
        accountHolder: formData.accountHolder.trim(),
        bankBin: formData.bankBin?.trim() || undefined,
      });
      queryClient.invalidateQueries({ queryKey: [...SELLER_INFO_KEY, accountId] });
      toast.success(PROFILE_MESSAGES.BANK_UPDATE_SUCCESS);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : PROFILE_MESSAGES.BANK_UPDATE_ERROR
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    seller,
    isLoading: isLoadingSeller,
    formData,
    isSubmitting,
    isSeller,
    handleChange,
    handleSubmit,
  };
}
