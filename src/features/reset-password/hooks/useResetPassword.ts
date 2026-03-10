import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { AUTH_MESSAGES } from "@/constants/messages";

interface UseResetPasswordParams {
  token: string | null;
}

interface UseResetPasswordReturn {
  newPassword: string;
  setNewPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  error: string;
  isLoading: boolean;
  isSuccess: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export function useResetPassword({ token }: UseResetPasswordParams): UseResetPasswordReturn {
  const router = useRouter();
  const toast = useToast();
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (newPassword.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (!token) {
      setError("Token không hợp lệ");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/account/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        toast.success(AUTH_MESSAGES.RESET_PASSWORD_SUCCESS);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(data.message || "Có lỗi xảy ra");
      }
    } catch {
      setError("Không thể kết nối đến server");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    isLoading,
    isSuccess,
    handleSubmit,
  };
}
