export type TabId = "profile" | "password";

export interface ProfileFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
}

export interface PasswordFormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
