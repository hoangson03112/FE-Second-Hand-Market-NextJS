'use client';

import { useState, useCallback, useEffect } from "react";
import type { ChangeEvent, FormEvent, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { SellerService } from "@/services/seller.service";
import { becomeSellerSchema, type BecomeSellerInput } from "@/schemas/becomeSeller.schema";
import type { SellerRequestStatus, SellerProductLimitResponse } from "@/types/seller";
import { UNVERIFIED_SELLER_PRODUCT_LIMIT } from "@/constants";

export type BecomeSellerFormValues = BecomeSellerInput & {
  agreeTerms: boolean;
  agreePolicy: boolean;
};

export type BecomeSellerErrors = Partial<Record<keyof BecomeSellerInput, string>> & {
  idCardFront?: string;
  idCardBack?: string;
};

const INITIAL: BecomeSellerFormValues = {
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
  const [values, setValues] = useState<BecomeSellerFormValues>(INITIAL);
  const [idCardFront, setIdCardFront] = useState<File | null>(null);
  const [idCardBack, setIdCardBack] = useState<File | null>(null);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [errors, setErrors] = useState<BecomeSellerErrors>({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [requestStatus, setRequestStatus] = useState<SellerRequestStatus | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [hasRequest, setHasRequest] = useState(false);
  const [productLimit, setProductLimit] = useState<SellerProductLimitResponse | null>(null);
  const [requiresVerification, setRequiresVerification] = useState(false);

  // Check seller request status and product limit on mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        setIsCheckingStatus(true);
        
        // Check request status
        const statusResponse = await SellerService.getRequestStatus();
        setHasRequest(statusResponse.hasRequest);
        setRequestStatus(statusResponse.status);
        
        // Check product limit (only if not already a seller)
        if (statusResponse.status !== "approved") {
          try {
            const limitResponse = await SellerService.getProductLimit();
            setProductLimit(limitResponse);
            setRequiresVerification(limitResponse.requiresVerification);
            
            // Show info message if approaching limit
            if (limitResponse.requiresVerification) {
              setApiError(
                `Bạn đã đăng ${limitResponse.totalProducts}/${limitResponse.limit} sản phẩm. ` +
                `Để tiếp tục đăng sản phẩm không giới hạn và nhận thanh toán online, ` +
                `vui lòng xác minh tài khoản seller.`
              );
            }
          } catch (limitErr) {
            console.error("Error checking product limit:", limitErr);
            // Don't block if limit check fails
          }
        }
        
        // Show status messages
        if (statusResponse.hasRequest && statusResponse.status === "pending") {
          setApiError("Bạn đã gửi yêu cầu trở thành seller. Vui lòng chờ phê duyệt.");
        } else if (statusResponse.hasRequest && statusResponse.status === "approved") {
          setApiError("Bạn đã là seller. Vui lòng quay lại trang chủ.");
        } else if (statusResponse.hasRequest && statusResponse.status === "rejected") {
          setApiError(statusResponse.message || "Yêu cầu của bạn đã bị từ chối. Vui lòng liên hệ hỗ trợ.");
        }
      } catch (err: unknown) {
        const ax = err as { response?: { data?: { message?: string } } };
        console.error("Error checking seller request status:", err);
        // Don't block form if check fails, just log error
      } finally {
        setIsCheckingStatus(false);
      }
    };

    checkStatus();
  }, []);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
      const checked = (e.target as HTMLInputElement).checked;
      setValues((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
      setApiError("");
      setErrors((prev) => (prev[name as keyof typeof prev] ? { ...prev, [name]: undefined } : prev));
    },
    []
  );

  const handleFile = useCallback(
    (field: "idCardFront" | "idCardBack" | "avatar") => (e: ChangeEvent<HTMLInputElement>) => {
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
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setApiError("");
      setErrors({});

      // Check if user already has a request
      if (hasRequest) {
        if (requestStatus === "pending") {
          setApiError("Bạn đã gửi yêu cầu trở thành seller. Vui lòng chờ phê duyệt.");
          return;
        }
        if (requestStatus === "approved") {
          setApiError("Bạn đã là seller. Vui lòng quay lại trang chủ.");
          router.push("/");
          return;
        }
        if (requestStatus === "rejected") {
          setApiError("Yêu cầu của bạn đã bị từ chối. Vui lòng liên hệ hỗ trợ để được giải đáp.");
          return;
        }
      }

      // Check product limit - if requires verification, allow but show info
      if (requiresVerification && productLimit) {
        // Still allow submission, but user should know they need verification
        // The backend should handle the limit check
      }

      if (!idCardFront || !idCardBack) {
        setErrors((prev) => ({
          ...prev,
          idCardFront: idCardFront ? undefined : "Vui lòng tải ảnh CCCD mặt trước",
          idCardBack: idCardBack ? undefined : "Vui lòng tải ảnh CCCD mặt sau",
        }));
      }
      const payload = {
        ...values,
        agreeTerms: values.agreeTerms === true,
        agreePolicy: values.agreePolicy === true,
      };
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
          setHasRequest(true);
          setRequestStatus("pending");
          router.push("/become-seller/success");
        } else {
          setApiError(response.message || "Đăng ký thất bại");
        }
      } catch (err: unknown) {
        const ax = err as { response?: { data?: { message?: string } } };
        const errorMessage = ax.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại";
        // Check if error is about duplicate request
        if (errorMessage.toLowerCase().includes("đã gửi") || errorMessage.toLowerCase().includes("already")) {
          setHasRequest(true);
          setRequestStatus("pending");
        }
        setApiError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [values, idCardFront, idCardBack, avatar, router, hasRequest, requestStatus, requiresVerification, productLimit]
  );

  return {
    values,
    setValues: setValues as Dispatch<SetStateAction<BecomeSellerFormValues>>,
    errors,
    apiError,
    isLoading,
    idCardFront,
    idCardBack,
    avatar,
    handleChange,
    handleFile,
    handleSubmit,
    requestStatus,
    isCheckingStatus,
    hasRequest,
    productLimit,
    requiresVerification,
  };
}
