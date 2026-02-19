import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import type { RegisterRequest } from "@/types/auth";
import { registerSchema, RegisterInput } from "@/schemas/auth.schema";

export function useRegister() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterInput>({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterInput, string>>>({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
    if (errors[name as keyof RegisterInput]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof RegisterInput;
    if (fieldName === "confirmPassword") {
      if (value !== formData.password) {
        setErrors({ ...errors, confirmPassword: "Mật khẩu xác nhận không khớp" });
      } else {
        setErrors({ ...errors, confirmPassword: undefined });
      }
      return;
    }
    if (!(fieldName in registerSchema.shape)) return;
    const result = registerSchema.shape[fieldName].safeParse(value);
    if (!result.success) {
      setErrors({ ...errors, [fieldName]: result.error.issues[0].message });
    } else {
      setErrors({ ...errors, [fieldName]: undefined });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setErrors({});
    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof RegisterInput, string>> = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof RegisterInput;
        if (fieldName) fieldErrors[fieldName] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setIsLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...registerData } = result.data;
      const response = await AuthService.register(registerData as RegisterRequest);
      if (response.status === "success") {
        router.push(`/verify-email?accountID=${response.accountID}`);
      } else {
        if (response.type === "username") setError("Tên đăng nhập đã được sử dụng");
        else if (response.type === "email") setError("Email đã được sử dụng");
        else if (response.type === "phoneNumber") setError("Số điện thoại đã được sử dụng");
        else setError(response.message || "Đăng ký thất bại");
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { type?: string; message?: string } } };
      const errorData = error.response?.data;
      if (errorData?.type === "username") setError("Tên đăng nhập đã được sử dụng");
      else if (errorData?.type === "email") setError("Email đã được sử dụng");
      else if (errorData?.type === "phoneNumber") setError("Số điện thoại đã được sử dụng");
      else setError(errorData?.message || "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    confirmPassword: formData.confirmPassword,
    errors,
    error,
    isLoading,
    handleChange,
    handleConfirmPasswordChange,
    handleBlur,
    handleSubmit,
  };
}
