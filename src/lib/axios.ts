import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

import { useBannedStore } from "@/store/useBannedStore";
import { notifySessionLost } from "./session";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;


const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  withCredentials: true,
});


const NO_REFRESH_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/logout",
  "/auth/verify",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/validate-reset-token",
  "/auth/appeal",
];

let refreshPromise: Promise<void> | null = null;


async function withCrossTabLock<T>(fn: () => Promise<T>): Promise<T> {
  const locks = typeof navigator !== "undefined" ? navigator.locks : undefined;
  if (!locks) return fn();
  return locks.request("eco:auth-refresh", fn);
}

function refreshSession(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = withCrossTabLock(() =>
      refreshClient.post("/auth/refresh").then(() => undefined),
    ).finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response.data,

  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;
    const status = error.response?.status;
    const url = originalRequest?.url ?? "";
    const payload = error.response?.data as
      | { message?: string; error?: string; code?: string }
      | undefined;

    if (payload?.message?.trim()) {
      error.message = payload.message;
    } else if (payload?.error?.trim()) {
      error.message = payload.error;
    }

    if (status === 403 && payload?.code === "account_banned") {
      notifySessionLost();
      useBannedStore.getState().setBanned(true);
      return Promise.reject(error);
    }

    const canRefresh =
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !NO_REFRESH_PATHS.some((path) => url.includes(path));

    if (canRefresh) {
      originalRequest._retry = true;
      try {
        await refreshSession();
        return await axiosClient(originalRequest);
      } catch (refreshError) {
        notifySessionLost();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
