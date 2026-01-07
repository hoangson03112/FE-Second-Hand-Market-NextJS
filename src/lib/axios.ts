import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { captureException } from "@/infrastructure/monitoring/sentry";
import { logger } from "@/infrastructure/monitoring/logger";
import { useTokenStore } from "@/store/useTokenStore";

/**
 * Centralized Axios Client
 * 
 * Features:
 * - Automatic token injection
 * - Error handling
 * - Request/Response logging
 * - Error tracking integration
 */
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
    // Lấy accessToken từ Zustand store
    const token = useTokenStore.getState().accessToken;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (process.env.NODE_ENV === "development") {
      logger.apiRequest(config.method?.toUpperCase() || "GET", config.url || "");
    }

    return config;
  },
  (error) => {
    captureException(error as Error, { context: "axios_request_interceptor" });
    return Promise.reject(error);
  }
);

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
  (error: AxiosError) => {
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

      switch (status) {
        case 401:
          console.error("Phiên làm việc hết hạn");
          // Handle logout: Clear accessToken from store
          if (typeof window !== "undefined") {
            useTokenStore.getState().clearAuth();
            // window.location.href = "/login";
          }
          break;
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

