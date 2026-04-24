import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import type { RegisterRequest } from "@/types/auth";
import { registerSchema, RegisterInput } from "@/features/auth/schemas/auth.schema";
import { sanitizeFieldInput, sanitizeFormValues } from "@/utils";
import { useToast } from "@/components/shared";

export function useRegister() {
  const router = useRouter();
  const toast = useToast();
  const [formData, setFormData] = useState<RegisterInput>({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterInput, string>>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const normalizedValue = sanitizeFieldInput(name, value);
    setFormData({ ...formData, [name]: normalizedValue });
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
    setErrors({});
    const normalizedData = sanitizeFormValues(formData);
    const result = registerSchema.safeParse(normalizedData);
    if (!result.success) {
      const firstMessage = result.error.issues[0]?.message || "Thông tin đăng ký không hợp lệ";
      toast.error(firstMessage);
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
        if (response.type === "username") toast.error("Tên đăng nhập đã được sử dụng");
        else if (response.type === "email") toast.error("Email đã được sử dụng");
        else if (response.type === "phoneNumber") toast.error("Số điện thoại đã được sử dụng");
        else toast.error(response.message || "Đăng ký thất bại");
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { type?: string; message?: string } } };
      const errorData = error.response?.data;
      if (errorData?.type === "username") toast.error("Tên đăng nhập đã được sử dụng");
      else if (errorData?.type === "email") toast.error("Email đã được sử dụng");
      else if (errorData?.type === "phoneNumber") toast.error("Số điện thoại đã được sử dụng");
      else toast.error(errorData?.message || "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    confirmPassword: formData.confirmPassword,
    errors,
    isLoading,
    handleChange,
    handleConfirmPasswordChange,
    handleBlur,
    handleSubmit,
  };
}
