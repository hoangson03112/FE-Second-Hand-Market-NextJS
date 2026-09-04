import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/features/auth/hooks/useUser";
import { BankService } from "@/services/bank.service";
import { useToast } from "@/components/ui";
import { PROFILE_MESSAGES } from "@/constants";
import type { BankFormData } from "../types";

const BANK_INFO_KEY = ["bank-info", "me"] as const;

export function useSellerBank() {
  const { data: account } = useUser();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<BankFormData>({
    bankName: "",
    accountNumber: "",
    accountHolder: "",
  });

  const accountId = account?.accountID;

  const { data: bankResponse, isLoading: isLoadingBank } = useQuery({
    queryKey: [...BANK_INFO_KEY, accountId],
    queryFn: () => BankService.getMyBankInfo(),
    enabled: !!accountId,
    retry: false,
  });

  const bankInfo = bankResponse?.data;

  useEffect(() => {
    if (bankInfo) {
      setFormData({
        bankName: bankInfo.bankName || "",
        accountNumber: bankInfo.accountNumber || "",
        accountHolder: bankInfo.accountHolder || "",
      });
    }
  }, [bankInfo]);

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
      await BankService.updateMyBankInfo({
        bankName: formData.bankName.trim(),
        accountNumber: formData.accountNumber.trim(),
        accountHolder: formData.accountHolder.trim().toUpperCase(),
      });
      queryClient.invalidateQueries({ queryKey: [...BANK_INFO_KEY, accountId] });
      toast.success("Cập nhật tài khoản ngân hàng thành công!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : PROFILE_MESSAGES.BANK_UPDATE_ERROR
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    bankInfo,
    isLoading: isLoadingBank,
    formData,
    isSubmitting,
    handleChange,
    handleSubmit,
  };
}
