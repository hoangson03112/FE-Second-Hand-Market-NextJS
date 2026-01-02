import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import type { RegisterRequest } from "@/types/auth";

export function useRegister() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterRequest>({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    fullName: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setIsLoading(true);

    try {
      const response = await AuthService.register(formData);

      if (response.status === "success") {
        router.push(`/verify-email?accountID=${response.accountID}`);
      } else {
        if (response.type === "username") {
          setError("Tên đăng nhập đã được sử dụng");
        } else if (response.type === "email") {
          setError("Email đã được sử dụng");
        } else if (response.type === "phoneNumber") {
          setError("Số điện thoại đã được sử dụng");
        } else {
          setError(response.message || "Đăng ký thất bại");
        }
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { type?: string; message?: string } } };
      const errorData = error.response?.data;
      if (errorData?.type === "username") {
        setError("Tên đăng nhập đã được sử dụng");
      } else if (errorData?.type === "email") {
        setError("Email đã được sử dụng");
      } else if (errorData?.type === "phoneNumber") {
        setError("Số điện thoại đã được sử dụng");
      } else {
        setError(errorData?.message || "Có lỗi xảy ra, vui lòng thử lại");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    confirmPassword,
    error,
    isLoading,
    handleChange,
    handleConfirmPasswordChange,
    handleSubmit,
  };
}

