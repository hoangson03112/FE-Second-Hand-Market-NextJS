export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  status: "success" | "password" | "login" | "inactive" | "error";
  message: string;
  token?: string; // accessToken - refreshToken được set vào HttpOnly cookie, không trả về trong body
  user?: any;
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
  token?: string; // accessToken - refreshToken được set vào HttpOnly cookie, không trả về trong body
}

export interface AccountInfo {
  accountID: string;
  fullName?: string;
  avatar?: string;
  cart?: any;
  role?: string;
  email: string;
  phoneNumber: string;
  createdAt?: string;
  addresses?: any[];
}

export interface AccountResponse {
  status: "success" | "error";
  message?: string;
  account?: AccountInfo;
}

