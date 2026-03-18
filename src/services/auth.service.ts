import axiosClient from "@/lib/axios";
import type {
  AccountInfo,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyRequest,
  VerifyResponse,
  AccountResponse,
  RefreshResponse,
} from "@/types/auth";

export const AuthService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return axiosClient.post("/auth/login", data);
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    return axiosClient.post("/auth/register", data);
  },

  verify: async (data: VerifyRequest): Promise<VerifyResponse> => {
    return axiosClient.post("/auth/verify", data);
  },

  getAccountInfo: async (): Promise<AccountResponse> => {
    return axiosClient.get("/auth/auth");
  },

  logout: async (): Promise<{ success: boolean; message: string }> => {
    return axiosClient.post("/auth/logout");
  },
  refresh: async (): Promise<RefreshResponse> => {
    return axiosClient.post("/auth/refresh");
  },

  updateProfile: async (data: {
    fullName: string;
    email: string;
    phoneNumber: string;
  }): Promise<{ message: string; updatedAccount: AccountInfo }> => {
    return axiosClient.put("/accounts/update", data);
  },
  changePassword: async (data: {
    oldPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> => {
    return axiosClient.put("/accounts/change-password", data);
  },

  /**
   * Thiết lập mật khẩu cho tài khoản Google (chưa có mật khẩu).
   * PUT /accounts/set-password
   */
  setPassword: async (data: { newPassword: string }): Promise<{ message: string }> => {
    return axiosClient.put("/accounts/set-password", data);
  },

  /**
   * Xác thực OTP email sau đăng nhập Google.
   * POST /auth/verify-google-email — body: { pending, code }
   */
  verifyGoogleEmail: async (data: {
    pending: string;
    code: string;
  }): Promise<{ status: string; message?: string; token?: string }> => {
    const res = await axiosClient.post("/auth/verify-google-email", data);
    return res as unknown as { status: string; message?: string; token?: string };
  },

  /**
   * Gửi khiếu nại khi tài khoản bị khóa (không cần token).
   * POST /auth/appeal — body: { email, fullName?, message }
   */
  submitAppeal: async (data: {
    email: string;
    fullName?: string;
    message: string;
  }): Promise<{ success: boolean; message: string }> => {
    const res = await axiosClient.post("/auth/appeal", data);
    return res as unknown as { success: boolean; message: string };
  },
};
