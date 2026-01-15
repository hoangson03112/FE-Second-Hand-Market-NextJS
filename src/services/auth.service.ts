import axiosClient from "@/lib/axios";
import type {
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
};
