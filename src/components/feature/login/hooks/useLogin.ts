import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";
import { useTokenStore } from "@/store/useTokenStore";
import { queryKeys } from "@/lib/query-client";
import type { LoginRequest } from "@/types/auth";
import { loginSchema } from "@/schemas/auth.schema";
import { getGoogleLoginUrl } from "@/constants";

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const { setAccessToken } = useTokenStore();
  const [formData, setFormData] = useState<LoginRequest>({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    const errorParam = searchParams.get("error");
    if (token) {
      setAccessToken(token);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.current() });
      router.replace("/");
      router.refresh();
      return;
    }
    if (errorParam) {
      const messages: Record<string, string> = {
        google_failed: "Đăng nhập Google thất bại. Vui lòng thử lại.",
        google_no_user: "Không lấy được thông tin tài khoản Google.",
        google_not_configured: "Chức năng đăng nhập Google chưa được cấu hình.",
      };
      setError(messages[errorParam] || "Có lỗi xảy ra.");
    }
  }, [searchParams, setAccessToken, queryClient, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: { username?: string; password?: string } = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        if (path && (path === "username" || path === "password")) {
          fieldErrors[path] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setIsLoading(true);
    try {
      const response = await AuthService.login(formData);
      if (response.status === "success" && response.token) {
        setAccessToken(response.token);
        queryClient.invalidateQueries({ queryKey: queryKeys.users.current() });
        router.push("/");
        router.refresh();
      } else {
        setError(response.message || "Đăng nhập thất bại");
      }
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { message?: string } } };
      setError(errObj.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại");
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
    error,
    isLoading,
    handleChange,
    handleSubmit,
    handleGoogleLogin,
  };
}
