import { useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { AUTH_MESSAGES } from "@/constants/messages";
import axiosClient from "@/lib/axios";

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
      // Use unified axios client + correct backend route.
      const data = await axiosClient.post("/auth/forgot-password", { email });
      setIsSuccess(true);
      toast.success( AUTH_MESSAGES.FORGOT_PASSWORD_EMAIL_SENT);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Không thể kết nối đến server";
      setError(message);
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
