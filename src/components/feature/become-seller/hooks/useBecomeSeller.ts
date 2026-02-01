"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SellerService } from "@/services/seller.service";
import { becomeSellerSchema, type BecomeSellerInput } from "@/schemas/becomeSeller.schema";

const INITIAL: BecomeSellerInput & { agreeTerms: boolean; agreePolicy: boolean } = {
  address: "",
  provinceId: "",
  districtId: "",
  wardCode: "",
  province: "",
  district: "",
  ward: "",
  bankName: "",
  accountNumber: "",
  accountHolder: "",
  agreeTerms: false,
  agreePolicy: false,
};

export function useBecomeSeller() {
  const router = useRouter();
  const [values, setValues] = useState(INITIAL);
  const [idCardFront, setIdCardFront] = useState<File | null>(null);
  const [idCardBack, setIdCardBack] = useState<File | null>(null);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof BecomeSellerInput, string>> & { idCardFront?: string; idCardBack?: string }>({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
      const checked = (e.target as HTMLInputElement).checked;
      setValues((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
      setApiError("");
      if (errors[name as keyof typeof errors]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    }
  );

  const handleFile = useCallback(
    (field: "idCardFront" | "idCardBack" | "avatar") => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, [field]: "Chỉ chấp nhận file ảnh" }));
        return;
      }
      if (field === "idCardFront") setIdCardFront(file);
      else if (field === "idCardBack") setIdCardBack(file);
      else setAvatar(file);
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setApiError("");
      setErrors({});
      if (!idCardFront || !idCardBack) {
        setErrors((prev) => ({
          ...prev,
          idCardFront: idCardFront ? undefined : "Vui lòng tải ảnh CCCD mặt trước",
          idCardBack: idCardBack ? undefined : "Vui lòng tải ảnh CCCD mặt sau",
        }));
      }
      const payload = { ...values, agreeTerms: values.agreeTerms === true, agreePolicy: values.agreePolicy === true };
      const result = becomeSellerSchema.safeParse(payload);
      if (!result.success) {
        const fieldErrors: Partial<Record<keyof BecomeSellerInput, string>> = {};
        result.error.issues.forEach((issue) => {
          const key = issue.path[0] as keyof BecomeSellerInput;
          if (key) fieldErrors[key] = issue.message;
        });
        setErrors((prev) => ({ ...prev, ...fieldErrors }));
        return;
      }
      if (!idCardFront || !idCardBack) return;
      setIsLoading(true);
      try {
        const formData = new FormData();
        formData.append("address", result.data.address);
        formData.append("province", result.data.province);
        formData.append("district", result.data.district);
        formData.append("ward", result.data.ward);
        formData.append("province_id", result.data.provinceId);
        formData.append("from_district_id", result.data.districtId);
        formData.append("from_ward_code", result.data.wardCode);
        formData.append("bankName", result.data.bankName);
        formData.append("accountNumber", result.data.accountNumber);
        formData.append("accountHolder", result.data.accountHolder);
        formData.append("agreeTerms", "true");
        formData.append("agreePolicy", "true");
        formData.append("idCardFront", idCardFront);
        formData.append("idCardBack", idCardBack);
        if (avatar) formData.append("avatar", avatar);
        const response = await SellerService.registerSeller(formData);
        if (response.success) {
          router.push("/become-seller/success");
        } else {
          setApiError(response.message || "Đăng ký thất bại");
        }
      } catch (err: unknown) {
        const ax = err as { response?: { data?: { message?: string } } };
        setApiError(ax.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại");
      } finally {
        setIsLoading(false);
      }
    },
    [values, idCardFront, idCardBack, avatar, router]
  );

  return {
    values,
    setValues,
    errors,
    apiError,
    isLoading,
    idCardFront,
    idCardBack,
    avatar,
    handleChange,
    handleFile,
    handleSubmit,
  };
}
