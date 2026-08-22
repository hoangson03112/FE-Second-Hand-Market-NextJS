import { Address } from "./address";

export interface LoginRequest {
  email: string;
  password: string;
  username?: string;
}

export interface LoginResponse {
  status: "success" | "password" | "login" | "inactive" | "banned" | "error";
  message: string;
  token?: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  fullName?: string;
}

export interface RegisterResponse {
  status: "success" | "error";
  message: string;
  /** Handle mờ đục của phiên xác minh. BE không trả accountID ra ngoài. */
  verificationToken?: string;
  /** Email đã che, chỉ để hiển thị: "ho****n@gmail.com". */
  maskedEmail?: string;
  type?: "username" | "email" | "phoneNumber";
  retryAfterSeconds?: number;
  expiresInMinutes?: number;
}

export interface VerifyRequest {
  verificationToken: string;
  code: string;
}

export interface VerifyResponse {
  status: "success" | "error";
  message: string;
  token?: string;
  accessToken?: string;
  /** CODE_EXPIRED | INVALID_CODE | ATTEMPTS_EXCEEDED | SESSION_EXPIRED */
  code?: string;
  /** Số lần nhập sai còn lại trước khi mã bị vô hiệu. */
  attemptsLeft?: number;
}

export interface ResendCodeResponse {
  status: "success" | "error";
  message: string;
  /** COOLDOWN | MAIL_FAILED | OTP_STORE_FAILED | SESSION_EXPIRED */
  code?: string;
  /** Số giây phải chờ trước khi được gửi lại lần nữa. */
  retryAfterSeconds?: number;
  expiresInMinutes?: number;
  maskedEmail?: string;
}

/** Nhánh 403 type: "inactive" của /auth/login — tài khoản chưa xác minh email. */
export interface InactiveLoginPayload {
  status: "error";
  type: "inactive";
  message: string;
  verificationToken?: string;
  maskedEmail?: string;
}

export type AccountProvider = "google" | "local";

export interface AccountInfo {
  accountID: string;
  fullName?: string;
  avatar?: string;
  role?: string;
  email: string;
  phoneNumber: string;
  createdAt?: string;
  addresses?: Address[];
  provider?: AccountProvider;
}

export interface AccountResponse {
  status: "success" | "error";
  message?: string;
  account?: AccountInfo;
}
export interface RefreshResponse {
  success: boolean;
  message: string;
  token?: string;
}
