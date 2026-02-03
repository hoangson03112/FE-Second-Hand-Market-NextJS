import { Address } from "./address";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  status: "success" | "password" | "login" | "inactive" | "error";
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
  accountID?: string;
  type?: "username" | "email" | "phoneNumber";
}

export interface VerifyRequest {
  userID: string;
  code: string;
}

export interface VerifyResponse {
  status: "success" | "error";
  message: string;
  token?: string;
  accessToken?: string;
}

export interface AccountInfo {
  accountID: string;
  fullName?: string;
  avatar?: string;
  role?: string;
  email: string;
  phoneNumber: string;
  createdAt?: string;
  addresses?: Address[];
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
