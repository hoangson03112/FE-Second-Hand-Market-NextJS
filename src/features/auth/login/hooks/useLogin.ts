import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";
import { useBannedStore } from "@/store/useBannedStore";
import { queryKeys } from "@/lib/query-client";
import { announceSession } from "@/lib/session";
import type { LoginRequest } from "@/types/auth";
import { loginSchema } from "@/schemas/auth.schema";
import { getGoogleLoginUrl } from "@/constants";
import { sanitizeFieldInput, sanitizeFormValues } from "@/utils";
import { useToast } from "@/components/shared";

const POST_LOGIN_REDIRECT_KEY = "eco:post-login-redirect";

function safeRedirect(target: string | null): string {
  if (!target || !target.startsWith("/") || target.startsWith("//")) return "/";
  return target;
}

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const setBanned = useBannedStore((s) => s.setBanned);
  const toast = useToast();

  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handledCallback = useRef(false);

  useEffect(() => {
    if (handledCallback.current) return;

    const errorParam = searchParams.get("error");
    if (!errorParam) return;

    handledCallback.current = true;

    if (errorParam === "account_banned") {
      setBanned(true);
      router.replace("/");
      return;
    }

    const messages: Record<string, string> = {
      google_failed: "Đăng nhập Google thất bại. Vui lòng thử lại.",
      google_no_user: "Không lấy được thông tin tài khoản Google.",
      google_not_configured: "Chức năng đăng nhập Google chưa được cấu hình.",
      google_verify_invalid:
        "Phiên xác minh không hợp lệ. Vui lòng đăng nhập lại bằng Google.",
    };
    toast.error(messages[errorParam] || "Có lỗi xảy ra khi xác thực Google.");
  }, [searchParams, router, queryClient, setBanned, toast]);

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
      const firstMessage =
        result.error.issues[0]?.message || "Thông tin đăng nhập không hợp lệ";
      toast.error(firstMessage);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      await AuthService.login({
        email: normalizedData.email,
        username: normalizedData.email,
        password: normalizedData.password,
      });

      queryClient.invalidateQueries({ queryKey: queryKeys.users.current() });
      announceSession("signed-in");

      router.replace(safeRedirect(searchParams.get("redirect")));
      router.refresh();
    } catch (err: unknown) {
      const statusCode = (err as { response?: { status?: number } }).response
        ?.status;

      if (statusCode === 403) {
        setBanned(true);
        router.push("/");
      } else if (statusCode === 401) {
        toast.error("Email hoặc mật khẩu không chính xác.");
      } else if ((err as { code?: string }).code === "ECONNABORTED") {
        toast.error("Máy chủ phản hồi quá lâu. Vui lòng thử lại.");
      } else {
        toast.error(
          (err as Error).message || "Có lỗi xảy ra, vui lòng thử lại sau.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const redirect = safeRedirect(searchParams.get("redirect"));
    if (redirect !== "/") {
      sessionStorage.setItem(POST_LOGIN_REDIRECT_KEY, redirect);
    }
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
