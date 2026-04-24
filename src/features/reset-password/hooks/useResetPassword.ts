import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/shared";
import { AUTH_MESSAGES } from "@/constants/messages";
import axiosClient from "@/lib/axios";

interface UseResetPasswordParams {
  token: string | null;
}

interface UseResetPasswordReturn {
  newPassword: string;
  setNewPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  isLoading: boolean;
  isSuccess: boolean;
  isCheckingToken: boolean;
  isTokenInvalid: boolean;
  invalidTokenMessage: string;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export function useResetPassword({ token }: UseResetPasswordParams): UseResetPasswordReturn {
  const router = useRouter();
  const toast = useToast();
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(Boolean(token));
  const [isTokenInvalid, setIsTokenInvalid] = useState(false);
  const [invalidTokenMessage, setInvalidTokenMessage] = useState("");
  const validatedTokenRef = useRef<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (!token) {
      setIsCheckingToken(false);
      setIsTokenInvalid(true);
      setInvalidTokenMessage(AUTH_MESSAGES.RESET_PASSWORD_INVALID_TOKEN);
      return () => {
        isMounted = false;
      };
    }

    if (validatedTokenRef.current === token) {
      return () => {
        isMounted = false;
      };
    }

    validatedTokenRef.current = token;

    const validateToken = async () => {
      setIsCheckingToken(true);
      try {
        await axiosClient.post("/auth/validate-reset-token", { token });
        if (!isMounted) return;
        setIsTokenInvalid(false);
        setInvalidTokenMessage("");
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data
            ?.message || AUTH_MESSAGES.RESET_PASSWORD_INVALID_TOKEN;

        if (!isMounted) return;
        setIsTokenInvalid(true);
        setInvalidTokenMessage(message);
        toast.error(message, "Link không hợp lệ");
      } finally {
        if (isMounted) {
          setIsCheckingToken(false);
        }
      }
    };

    validateToken();

    return () => {
      isMounted = false;
    };
  }, [token, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (newPassword.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    if (!token) {
      toast.error("Token không hợp lệ");
      return;
    }

    if (isCheckingToken || isTokenInvalid) {
      toast.error(invalidTokenMessage || AUTH_MESSAGES.RESET_PASSWORD_INVALID_TOKEN);
      return;
    }

    setIsLoading(true);

    try {
      await axiosClient.post("/auth/reset-password", { token, newPassword });
      setIsSuccess(true);
      toast.success(AUTH_MESSAGES.RESET_PASSWORD_SUCCESS);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || AUTH_MESSAGES.GENERAL_ERROR;
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    isSuccess,
    isCheckingToken,
    isTokenInvalid,
    invalidTokenMessage,
    handleSubmit,
  };
}
