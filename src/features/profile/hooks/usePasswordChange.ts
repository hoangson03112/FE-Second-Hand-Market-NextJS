import { useState } from "react";
import { AuthService } from "@/services/auth.service";
import { useToast } from "@/components/ui/Toast";
import type { PasswordFormData } from "../types";
import { PROFILE_MESSAGES, PASSWORD_MIN_LENGTH } from "@/constants";

export function usePasswordChange(isGoogleUser: boolean) {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<PasswordFormData>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error(PROFILE_MESSAGES.PASSWORD_MISMATCH);
      return;
    }

    if (formData.newPassword.length < PASSWORD_MIN_LENGTH) {
      toast.error(PROFILE_MESSAGES.PASSWORD_TOO_SHORT);
      return;
    }

    if (!isGoogleUser && !formData.oldPassword) {
      toast.error("Vui lòng nhập mật khẩu hiện tại.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isGoogleUser) {
        await AuthService.setPassword({ newPassword: formData.newPassword });
        setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        toast.success(PROFILE_MESSAGES.SET_PASSWORD_SUCCESS);
      } else {
        await AuthService.changePassword({
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        });
        setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        toast.success(PROFILE_MESSAGES.PASSWORD_CHANGE_SUCCESS);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : (isGoogleUser ? PROFILE_MESSAGES.SET_PASSWORD_ERROR : PROFILE_MESSAGES.PASSWORD_CHANGE_ERROR);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    handleChange,
    handleSubmit,
  };
}
