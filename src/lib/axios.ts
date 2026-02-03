/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { captureException } from "@/infrastructure/monitoring/sentry";
import { logger } from "@/infrastructure/monitoring/logger";
import { useTokenStore } from "@/store/useTokenStore";
import { AuthService } from "@/services/auth.service";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request Interceptor
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useTokenStore.getState().accessToken;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // If sending FormData (file upload), let the browser/axios set the correct multipart boundary
    // (do NOT force application/json from defaults)
    if (config.data instanceof FormData && config.headers) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete (config.headers as any)["Content-Type"];
    }

    // Log request in development
    if (process.env.NODE_ENV === "development") {
      logger.apiRequest(
        config.method?.toUpperCase() || "GET",
        config.url || ""
      );
    }

    return config;
  },
  (error) => {
    captureException(error as Error, { context: "axios_request_interceptor" });
    return Promise.reject(error);
  }
);

// Track if we're currently refreshing to avoid multiple refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
  config: InternalAxiosRequestConfig;
}> = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      // Update token in request header before retrying
      if (token && prom.config.headers) {
        prom.config.headers.Authorization = `Bearer ${token}`;
      }
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Response Interceptor
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful response
    if (process.env.NODE_ENV === "development") {
      logger.apiResponse(
        response.config.method?.toUpperCase() || "GET",
        response.config.url || "",
        response.status
      );
    }

    // Return data directly for easier usage in services
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response) {
      const status = error.response.status;
      const url = error.config?.url || "";

      // Log error
      logger.apiResponse(
        error.config?.method?.toUpperCase() || "GET",
        url,
        status
      );

      // Track error
      captureException(error as Error, {
        context: "axios_response_error",
        status,
        url,
      });

      // Handle 401 - Access Token Expired
      if (status === 401 && !originalRequest._retry) {
        const skipRefreshUrls = [
          "/auth/login",
          "/auth/register",
          "/auth/refresh",
          "/auth/logout",
        ];
        const shouldSkipRefresh = skipRefreshUrls.some((skipUrl) =>
          url.includes(skipUrl)
        );

        if (shouldSkipRefresh) {
          return Promise.reject(error);
        }

        // If already refreshing, queue this request
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject, config: originalRequest });
          })
            .then(() => {
              // originalRequest header has been updated in processQueue
              return axiosClient(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const response = await AuthService.refresh();

          const accessToken = response?.token;

          if (accessToken) {
            useTokenStore.getState().setAccessToken(accessToken);

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            }

            processQueue(null, accessToken);

            // Retry the original request with new token
            return axiosClient(originalRequest);
          }
        } catch (refreshError) {
          processQueue(refreshError as AxiosError, null);

          // Refresh token expired or invalid - Logout user
          console.error("Phiên làm việc hết hạn. Vui lòng đăng nhập lại.");
          if (typeof window !== "undefined") {
            useTokenStore.getState().clearAuth();
            window.location.href = "/login";
          }

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // Handle other errors
      switch (status) {
        case 403:
          console.error("Bạn không có quyền truy cập");
          break;
        case 500:
          console.error("Lỗi Server");
          break;
        default:
          console.error("Lỗi hệ thống:", error.message);
      }
    } else if (error.request) {
      // Network error
      logger.error("Network error - no response received", error as Error, {
        url: error.config?.url,
      });
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
