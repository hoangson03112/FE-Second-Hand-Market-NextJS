import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

import { useBannedStore } from "@/store/useBannedStore";
import { notifySessionLost } from "./session";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * KHÔNG đặt mặc định `Content-Type: application/json` ở đây.
 *
 * Từ axios 1.x, `transformRequest` thấy payload là FormData mà header đã là
 * JSON thì nó **chuyển FormData thành JSON** (`JSON.stringify(formDataToJSON(data))`)
 * — File bị serialize thành `{}` và request không còn là multipart, nên multer
 * ở backend không parse được: mọi endpoint upload (biên lai chuyển khoản, đăng
 * ký seller, ảnh sản phẩm, ảnh chat, ảnh khiếu nại) đều trả về "thiếu file".
 *
 * Để trống thì axios tự chọn đúng: `application/json` cho object thường, và
 * `multipart/form-data; boundary=...` cho FormData.
 */
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
