import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";
import { useTokenStore } from "@/store/useTokenStore";
import { useBannedStore } from "@/store/useBannedStore";
import { queryKeys } from "@/lib/query-client";
import type { LoginRequest } from "@/types/auth";
import { loginSchema } from "@/features/auth/schemas/auth.schema";
import { getGoogleLoginUrl } from "@/constants";
import { sanitizeFieldInput, sanitizeFormValues } from "@/utils";
import { useToast } from "@/components/shared";

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const { setAccessToken } = useTokenStore();
  const setBanned = useBannedStore((s) => s.setBanned);
  const toast = useToast();
  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    const errorParam = searchParams.get("error");
    if (token) {
      // Google login keeps the long-lived behavior.
      setAccessToken(token, { remember: true });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.current() });
      const redirect = searchParams.get("redirect");
      const target = redirect && redirect.startsWith("/") && !redirect.startsWith("//")
        ? redirect
        : "/";
      router.replace(target);
      router.refresh();
      return;
    }
    if (errorParam) {
      // Nếu login Google trả về account_banned → bật overlay banned + đưa về Home
      if (errorParam === "account_banned") {
        setBanned(true);
        router.replace("/");
        router.refresh();
        return;
      }
      const messages: Record<string, string> = {
        google_failed: "Đăng nhập Google thất bại. Vui lòng thử lại.",
        google_no_user: "Không lấy được thông tin tài khoản Google.",
        google_not_configured: "Chức năng đăng nhập Google chưa được cấu hình.",
        google_verify_invalid: "Phiên xác minh không hợp lệ. Vui lòng đăng nhập lại bằng Google.",
      };
      toast.error(messages[errorParam] || "Có lỗi xảy ra.");
    }
  }, [searchParams, setAccessToken, queryClient, router, setBanned, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const normalizedValue = sanitizeFieldInput(name, value);
    setFormData({ ...formData, [name]: normalizedValue });
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedData = sanitizeFormValues(formData);
    const result = loginSchema.safeParse(normalizedData);
    if (!result.success) {
      const firstMessage = result.error.issues[0]?.message || "Thông tin đăng nhập không hợp lệ";
      toast.error(firstMessage);
      setErrors({});
      return;
    }
    setErrors({});
    setIsLoading(true);
    try {
      const response = await AuthService.login({
        email: normalizedData.email,
        username: normalizedData.email,
        password: normalizedData.password,
      });
      if (response.status === "success" && response.token) {
        setAccessToken(response.token, { remember: rememberMe });
        queryClient.invalidateQueries({ queryKey: queryKeys.users.current() });
        const redirect = searchParams.get("redirect");
        const target = redirect && redirect.startsWith("/") && !redirect.startsWith("//")
          ? redirect
          : "/";
        router.push(target);
        router.refresh();
      } else if (response.status === "banned") {
        // Tài khoản bị khóa: bật overlay và đưa user về Home
        setBanned(true);
        router.push("/");
        router.refresh();
      } else {
        toast.error(response.message || "Đăng nhập thất bại");
      }
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { message?: string } } };
      toast.error(errObj.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = getGoogleLoginUrl();
  };

  return {
    formData,
    errors,
    isLoading,
    rememberMe,
    handleChange,
    setRememberMe,
    handleSubmit,
    handleGoogleLogin,
  };
}
