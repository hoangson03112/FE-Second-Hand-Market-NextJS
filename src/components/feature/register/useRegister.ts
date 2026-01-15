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
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear errors khi user đang typing
    setError("");
    if (errors[name as keyof RegisterInput]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e); // Sử dụng handleChange chung
  };

  // Validate field khi blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof RegisterInput;
    
    // Validate từng field (trừ confirmPassword vì nó cần validate với password)
    if (fieldName === "confirmPassword") {
      // Validate confirmPassword với password hiện tại
      if (value !== formData.password) {
        setErrors({
          ...errors,
          confirmPassword: "Mật khẩu xác nhận không khớp",
        });
      } else {
        setErrors({ ...errors, confirmPassword: undefined });
      }
      return;
    }

    // Skip nếu không phải field của schema (để tránh lỗi runtime)
    if (!(fieldName in registerSchema.shape)) {
      return;
    }

    const result = registerSchema.shape[fieldName].safeParse(value);
    if (!result.success) {
      setErrors({
        ...errors,
        [fieldName]: result.error.issues[0].message,
      });
    } else {
      setErrors({ ...errors, [fieldName]: undefined });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setErrors({});

    // Validate toàn bộ form với Zod
    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      // Convert Zod errors thành object
      const fieldErrors: Partial<Record<keyof RegisterInput, string>> = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof RegisterInput;
        if (fieldName) {
          fieldErrors[fieldName] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    // Submit với data đã validate
    setIsLoading(true);

    try {
      // Loại bỏ confirmPassword trước khi gửi API
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...registerData } = result.data;
      const response = await AuthService.register(registerData as RegisterRequest);

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
    confirmPassword: formData.confirmPassword, // For backward compatibility
    errors, // Validation errors từ Zod
    error, // API error
    isLoading,
    handleChange,
    handleConfirmPasswordChange,
    handleBlur, // Thêm handleBlur
    handleSubmit,
  };
}

