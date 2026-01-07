import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";
import { useTokenStore } from "@/store/useTokenStore";
import { queryKeys } from "@/lib/query-client";
import type { LoginRequest } from "@/types/auth";

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setAccessToken } = useTokenStore();
  const [formData, setFormData] = useState<LoginRequest>({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await AuthService.login(formData);

      if (response.status === "success" && response.token) {
        setAccessToken(response.token);
        
        // Invalidate user query to refetch account info
        queryClient.invalidateQueries({ queryKey: queryKeys.users.current() });

        router.push("/");
        router.refresh();
      } else {
        setError(response.message || "Đăng nhập thất bại");
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    error,
    isLoading,
    handleChange,
    handleSubmit,
  };
}
