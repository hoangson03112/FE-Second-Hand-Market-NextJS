export type TabId = "profile" | "password" | "bank";

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

export interface BankFormData {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  bankBin?: string;
}
