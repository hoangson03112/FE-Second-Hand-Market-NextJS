import { useState } from "react";
import { AuthService } from "@/services/auth.service";
import { useToast } from "@/components/ui";
import type { PasswordFormData } from "../types";
import { PROFILE_MESSAGES, PASSWORD_MIN_LENGTH } from "@/constants";

export function usePasswordChange() {
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

    setIsSubmitting(true);
    try {
      await AuthService.changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      toast.success(PROFILE_MESSAGES.PASSWORD_CHANGE_SUCCESS);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : PROFILE_MESSAGES.PASSWORD_CHANGE_ERROR
      );
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
