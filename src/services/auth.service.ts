import axiosClient from "@/lib/axios";
import type {
  AccountInfo,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyRequest,
  VerifyResponse,
  ResendCodeResponse,
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

  resendVerificationCode: async (data: {
    verificationToken: string;
  }): Promise<ResendCodeResponse> => {
    const res = await axiosClient.post("/auth/resend-verification-code", data);
    return res as unknown as ResendCodeResponse;
  },

  getAccountInfo: async (): Promise<AccountResponse> => {
    return axiosClient.get("/auth/me");
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

  setPassword: async (data: {
    newPassword: string;
  }): Promise<{ message: string }> => {
    return axiosClient.put("/accounts/set-password", data);
  },

  submitAppeal: async (data: {
    email: string;
    fullName?: string;
    message: string;
  }): Promise<{ success: boolean; message: string }> => {
    const res = await axiosClient.post("/auth/appeal", data);
    return res as unknown as { success: boolean; message: string };
  },
};
