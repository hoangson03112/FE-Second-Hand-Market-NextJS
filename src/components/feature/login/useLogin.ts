import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { useUserStore } from "@/store/useUserStore";
import type { LoginRequest } from "@/types/auth";

export function useLogin() {
  const router = useRouter();
  const { setAccount, setAccessToken } = useUserStore();
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
        // Lưu accessToken vào Zustand store
        // refreshToken đã được backend set vào HttpOnly cookie tự động
        setAccessToken(response.token);

        // Call API để lấy thông tin account
        try {
          const accountResponse = await AuthService.getAccountInfo();
          if (accountResponse.status === "success" && accountResponse.account) {
            setAccount(accountResponse.account);
          }
        } catch (accountError) {
          console.error("Error fetching account info:", accountError);
          // Không block flow nếu lỗi lấy account info
        }

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
