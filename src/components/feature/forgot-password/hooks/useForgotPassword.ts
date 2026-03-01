import { useState } from "react";
import { useToast } from "@/components/ui/Toast";

interface UseForgotPasswordReturn {
  email: string;
  setEmail: (email: string) => void;
  error: string;
  isLoading: boolean;
  isSuccess: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
}

export function useForgotPassword(): UseForgotPasswordReturn {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/account/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        toast.success(data.message || "Link reset đã được gửi đến email của bạn");
      } else {
        setError(data.message || "Có lỗi xảy ra");
      }
    } catch {
      setError("Không thể kết nối đến server");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setIsSuccess(false);
    setEmail("");
    setError("");
  };

  return {
    email,
    setEmail,
    error,
    isLoading,
    isSuccess,
    handleSubmit,
    resetForm,
  };
}
