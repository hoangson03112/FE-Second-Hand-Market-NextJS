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
  headers: {
    "Content-Type": "application/json",
  },
  // Xác thực chạy hoàn toàn bằng cookie httpOnly do backend set.
  withCredentials: true,
});

/**
 * Client riêng cho /auth/refresh: không gắn interceptor nên không thể tự gọi
 * lại chính nó, và tránh vòng import axios ↔ auth.service.
 */
const refreshClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  withCredentials: true,
});

/**
 * Các endpoint mà 401/403 là câu trả lời nghiệp vụ hợp lệ (sai mật khẩu, mã
 * xác thực hết hạn, chưa đăng nhập...) chứ không phải access token hết hạn.
 * Thử refresh ở đây sẽ nuốt mất thông báo lỗi thật gửi cho người dùng.
 */
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

/**
 * Single-flight trong cùng tab: mọi request bị 401 một lúc đều chờ chung một
 * lần refresh, thay vì mỗi request tự gọi /auth/refresh.
 */
let refreshPromise: Promise<void> | null = null;

/**
 * Khoá liên tab: backend xoay vòng refresh token, nên hai tab cùng gọi
 * /auth/refresh trong một khoảnh khắc sẽ khiến tab chậm hơn cầm token đã bị
 * thay. Web Locks đảm bảo tại một thời điểm chỉ một tab thực sự refresh; các
 * tab còn lại chờ rồi dùng luôn cookie mới. (Backend còn có thêm cửa sổ ân hạn
 * 60 giây làm lớp phòng vệ thứ hai cho trình duyệt không hỗ trợ Web Locks.)
 */
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
  // Trả thẳng payload nghiệp vụ để service không phải bóc `.data` ở mọi nơi.
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

    // Ưu tiên thông báo nghiệp vụ của backend thay vì
    // "Request failed with status code ..." của axios.
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
