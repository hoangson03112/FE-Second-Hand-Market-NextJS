import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/hooks/useUser";
import { AuthService } from "@/services/auth.service";
import { useToast } from "@/components/ui/Toast";
import { queryKeys } from "@/lib/query-client";
import type { ProfileFormData } from "../types";
import { PROFILE_MESSAGES } from "@/constants";
import { sanitizeFieldInput, sanitizeFormValues } from "@/utils";

export function useProfile() {
  const router = useRouter();
  const { data: account, isLoading } = useUser();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
  });

  useEffect(() => {
    if (account) {
      setFormData({
        fullName: account.fullName || "",
        email: account.email || "",
        phoneNumber: account.phoneNumber || "",
      });
    }
  }, [account]);

  useEffect(() => {
    if (!isLoading && !account) {
      router.push("/login");
    }
  }, [account, isLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const normalizedValue = sanitizeFieldInput(name, value);
    setFormData((prev) => ({ ...prev, [name]: normalizedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const normalizedData = sanitizeFormValues(formData);
      const isGoogleUser = account?.provider === "google";
      const payload = isGoogleUser
        ? {
            fullName: normalizedData.fullName,
            phoneNumber: normalizedData.phoneNumber,
            email: account!.email,
          }
        : normalizedData;

      await AuthService.updateProfile(payload);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.current() });
      toast.success(PROFILE_MESSAGES.PROFILE_UPDATE_SUCCESS);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : PROFILE_MESSAGES.PROFILE_UPDATE_ERROR
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    account,
    isLoading,
    formData,
    isSubmitting,
    isGoogleUser: account?.provider === "google",
    handleChange,
    handleSubmit,
  };
}
